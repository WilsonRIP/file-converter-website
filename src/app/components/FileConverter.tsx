'use client'

import React, { useState, useCallback, useTransition } from 'react'
import { useDropzone, FileRejection } from 'react-dropzone'
import Link from 'next/link'
import { convertImageAction } from '../actions' // Import the server action
import { authClient } from '@/lib/auth-client' // Import auth client

// Constants
const MAX_FILE_SIZE_MB = 10
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

// Define the supported output formats
const outputFormats = ['JPG', 'PNG', 'GIF', 'WEBP'] as const
type OutputFormat = (typeof outputFormats)[number]

// Type for client-side state and results
interface ClientConversionResult {
  success: boolean
  fileUrl?: string // Use fileUrl matching the server action
  error?: string
  originalFilename: string
}

// Update UploadedFile interface to reflect potential result structure
interface UploadedFile {
  file: File
  id: string
  outputFormat: OutputFormat
  status: 'pending' | 'converting' | 'completed' | 'error'
  resultUrl?: string // Stores the fileUrl on success
  error?: string
}

export default function FileConverter() {
  const { data: session, isPending: isSessionLoading } = authClient.useSession()
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [rejectedFiles, setRejectedFiles] = useState<FileRejection[]>([])
  const [isPending, startTransition] = useTransition()

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      const newFiles = acceptedFiles.map((file) => ({
        file,
        id: Math.random().toString(36).substring(2, 15), // Simple unique ID
        outputFormat: 'PNG' as OutputFormat, // Default output format
        status: 'pending' as const,
      }))
      setUploadedFiles((prevFiles) => [...prevFiles, ...newFiles])
      setRejectedFiles(fileRejections)
    },
    []
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
      'image/webp': ['.webp'],
      'image/bmp': ['.bmp'],
      'image/tiff': ['.tif', '.tiff'],
      'image/heic': ['.heic'],
      'image/heif': ['.heif'],
    },
    maxSize: MAX_FILE_SIZE_BYTES,
    disabled: !session || isSessionLoading,
  })

  const handleFormatChange = (id: string, format: OutputFormat) => {
    setUploadedFiles((prevFiles) =>
      prevFiles.map((f) => (f.id === id ? { ...f, outputFormat: format } : f))
    )
  }

  const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as ArrayBuffer)
      reader.onerror = reject
      reader.readAsArrayBuffer(file)
    })
  }

  const handleConvert = () => {
    startTransition(async () => {
      const filesToConvert = uploadedFiles.filter((f) => f.status === 'pending')
      if (filesToConvert.length === 0) return

      // Set status to converting for all pending files
      setUploadedFiles((prevFiles) =>
        prevFiles.map((f) =>
          filesToConvert.some((ftc) => ftc.id === f.id)
            ? { ...f, status: 'converting' }
            : f
        )
      )

      const conversionPromises = filesToConvert.map(async (fileToConvert) => {
        try {
          const buffer = await readFileAsArrayBuffer(fileToConvert.file)
          const result = await convertImageAction(
            buffer,
            fileToConvert.file.name,
            fileToConvert.outputFormat
          )
          return { id: fileToConvert.id, ...result }
        } catch (error) {
          console.error(
            'Client-side error during conversion prep or action call:',
            error
          )
          // Ensure error result structure aligns with ConversionResult + id
          return {
            id: fileToConvert.id,
            success: false,
            error:
              error instanceof Error
                ? error.message
                : 'Client error during conversion',
            originalFilename: fileToConvert.file.name,
            fileUrl: undefined, // Explicitly add optional fileUrl for type compatibility
          }
        }
      })

      // Type assertion using the client-defined type
      const results = (await Promise.all(
        conversionPromises
      )) as (ClientConversionResult & { id: string })[]

      // Update file statuses based on results
      setUploadedFiles((prevFiles) =>
        prevFiles.map((f) => {
          const result = results.find((r) => r.id === f.id)
          if (result) {
            if (result.success && result.fileUrl) {
              return {
                ...f,
                status: 'completed' as const,
                resultUrl: result.fileUrl,
                error: undefined,
              }
            } else {
              return {
                ...f,
                status: 'error' as const,
                resultUrl: undefined,
                error: result.error || 'Unknown conversion error',
              }
            }
          }
          return f
        })
      )
    })
  }

  const handleRemoveFile = (id: string) => {
    setUploadedFiles((prevFiles) => prevFiles.filter((f) => f.id !== id))
  }

  if (isSessionLoading) {
    return (
      <div className="p-10 text-center dark:text-gray-300">
        Loading session...
      </div>
    )
  }

  if (!session) {
    return (
      <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-10 text-center dark:border-yellow-700 dark:bg-yellow-900/30">
        <p className="text-yellow-800 dark:text-yellow-200">
          Please{' '}
          <Link
            href="/login"
            className="font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            login
          </Link>{' '}
          to use the file converter.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`cursor-pointer rounded-lg border-2 border-dashed p-10 text-center transition-colors ${
          isDragActive
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
            : 'border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500'
        } ${!session || isSessionLoading ? 'cursor-not-allowed bg-gray-100 opacity-50 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'} text-gray-600 dark:text-gray-300`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>
            Drag &apos;n&apos; drop some image files here, or click to select
            files
          </p>
        )}
        <p className="mt-2 text-xs">
          (Supported: JPG, PNG, GIF, WEBP, BMP, TIFF, HEIC)
        </p>
        <p className="mt-2 text-xs">(Max file size: {MAX_FILE_SIZE_MB}MB)</p>
      </div>

      {rejectedFiles.length > 0 && (
        <div
          className="relative rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700 dark:border-red-700 dark:bg-red-900/30 dark:text-red-300"
          role="alert"
        >
          <strong className="font-bold">File Rejection:</strong>
          <ul className="list-inside list-disc text-sm">
            {rejectedFiles.map(({ file, errors }) => (
              <li key={file.name}>
                {file.name} - {errors.map((e) => e.message).join(', ')}
              </li>
            ))}
          </ul>
          <button
            onClick={() => setRejectedFiles([])}
            className="absolute top-0 right-0 bottom-0 px-4 py-3"
          >
            <span className="text-xl">×</span>
          </button>
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="space-y-4 rounded-lg bg-white p-4 shadow dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-semibold dark:text-white">
            Files to Convert
          </h2>
          {uploadedFiles.map((uploadedFile) => (
            <div
              key={uploadedFile.id}
              className="flex items-center justify-between border-b border-gray-200 pb-2 last:border-b-0 dark:border-gray-700"
            >
              <div className="mr-4 flex flex-grow flex-col overflow-hidden">
                <span
                  className="truncate text-sm dark:text-gray-200"
                  title={uploadedFile.file.name}
                >
                  {uploadedFile.file.name}
                </span>
                {uploadedFile.status === 'error' && (
                  <span
                    className="truncate text-xs text-red-500 dark:text-red-400"
                    title={uploadedFile.error}
                  >
                    Error: {uploadedFile.error}
                  </span>
                )}
              </div>
              <div className="flex flex-shrink-0 items-center space-x-2">
                {uploadedFile.status === 'pending' && (
                  <select
                    value={uploadedFile.outputFormat}
                    onChange={(e) =>
                      handleFormatChange(
                        uploadedFile.id,
                        e.target.value as OutputFormat
                      )
                    }
                    className="rounded border border-gray-300 bg-white px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                  >
                    {outputFormats.map((format) => (
                      <option key={format} value={format}>
                        {format}
                      </option>
                    ))}
                  </select>
                )}
                {uploadedFile.status === 'converting' && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Converting...
                  </span>
                )}
                {uploadedFile.status === 'completed' &&
                  uploadedFile.resultUrl && (
                    <a
                      href={uploadedFile.resultUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-green-600 hover:underline dark:text-green-400"
                    >
                      Download {uploadedFile.outputFormat}
                    </a>
                  )}

                {(uploadedFile.status === 'pending' ||
                  uploadedFile.status === 'error') && (
                  <button
                    onClick={() => handleRemoveFile(uploadedFile.id)}
                    className="text-sm text-red-500 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:text-red-400"
                    title="Remove"
                    disabled={isPending}
                  >
                    X
                  </button>
                )}
              </div>
            </div>
          ))}
          <button
            onClick={handleConvert}
            className="mt-4 w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50 dark:focus:ring-offset-gray-800"
            disabled={
              isPending || !uploadedFiles.some((f) => f.status === 'pending')
            }
          >
            {isPending
              ? 'Converting...'
              : `Convert ${uploadedFiles.filter((f) => f.status === 'pending').length} File(s)`}
          </button>
        </div>
      )}
    </div>
  )
}
