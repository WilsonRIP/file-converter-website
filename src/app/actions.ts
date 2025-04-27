'use server'

import sharp from 'sharp'
import { UTApi } from 'uploadthing/server'
import { auth } from '../lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

// Instantiate UTApi
const utapi = new UTApi()

type OutputFormat = 'JPG' | 'PNG' | 'GIF' | 'WEBP'

interface ConversionResult {
  success: boolean
  fileUrl?: string
  error?: string
  originalFilename: string
}

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024 // 10MB

// Helper function to get the MIME type from the format
function getMimeType(format: OutputFormat): string {
  switch (format.toUpperCase()) {
    case 'JPG':
      return 'image/jpeg'
    case 'PNG':
      return 'image/png'
    case 'GIF':
      return 'image/gif'
    case 'WEBP':
      return 'image/webp'
    default:
      throw new Error(`Unsupported format: ${format}`)
  }
}

// Helper to generate a unique filename for storage
function generateUniqueFilename(
  originalName: string,
  targetFormat: OutputFormat
): string {
  const nameWithoutExtension =
    originalName.split('.').slice(0, -1).join('.') || originalName
  const timestamp = Date.now()
  const randomSuffix = Math.random().toString(36).substring(2, 8)
  return `${nameWithoutExtension}-${timestamp}-${randomSuffix}.${targetFormat.toLowerCase()}`
}

export async function convertImageAction(
  fileBuffer: ArrayBuffer,
  originalFilename: string,
  targetFormat: OutputFormat
): Promise<ConversionResult> {
  // --- Authentication Check ---
  let session
  try {
    session = await auth.api.getSession({ headers: await headers() })
  } catch (e) {
    console.error('Error getting session:', e)
    // Handle cases where session check itself fails (e.g., config issue)
    return {
      success: false,
      error: 'Session check failed.',
      originalFilename,
    }
  }

  if (!session) {
    return {
      success: false,
      error: 'Authentication required.',
      originalFilename,
    }
  }
  // --- End Authentication Check ---

  // Server-side file size validation
  if (fileBuffer.byteLength > MAX_FILE_SIZE_BYTES) {
    return {
      success: false,
      error: `File size exceeds the limit of ${MAX_FILE_SIZE_BYTES / 1024 / 1024}MB.`,
      originalFilename,
    }
  }

  // Basic validation (more can be added, e.g., file size limits)
  if (!fileBuffer || fileBuffer.byteLength === 0) {
    return { success: false, error: 'No file provided.', originalFilename }
  }
  if (!targetFormat) {
    return {
      success: false,
      error: 'No target format specified.',
      originalFilename,
    }
  }

  console.log(`Converting ${originalFilename} to ${targetFormat}`)

  try {
    const buffer = Buffer.from(fileBuffer)
    const sharpInstance = sharp(buffer)

    // Perform the conversion
    const convertedBuffer = await sharpInstance
      .toFormat(targetFormat.toLowerCase() as keyof sharp.FormatEnum, {
        // Add specific format options if needed, e.g.:
        // quality: 80, // for JPG/WEBP
        // lossless: true, // for WEBP
      })
      .toBuffer()

    const newFilename = generateUniqueFilename(originalFilename, targetFormat)
    const mimeType = getMimeType(targetFormat)

    console.log(`Uploading ${newFilename} to UploadThing...`)

    // Upload the converted buffer to UploadThing
    const uploadResponse = await utapi.uploadFiles(
      new File([convertedBuffer], newFilename, { type: mimeType })
    )

    // Check response, handle potential errors during upload
    if (uploadResponse.error) {
      console.error('UploadThing upload error:', uploadResponse.error)
      throw new Error(`Upload failed: ${uploadResponse.error.message}`)
    }

    // Use the recommended ufsUrl field
    const fileUrl = uploadResponse.data?.ufsUrl

    if (!fileUrl) {
      console.error('UploadThing response missing ufsUrl:', uploadResponse)
      throw new Error('Upload succeeded but no URL was returned.')
    }

    console.log(
      `Successfully converted and uploaded ${originalFilename} to ${fileUrl}`
    )
    return { success: true, fileUrl, originalFilename }
  } catch (error) {
    console.error(`Error converting/uploading ${originalFilename}:`, error)
    const errorMessage =
      error instanceof Error ? error.message : 'Conversion or upload failed'
    return {
      success: false,
      error: errorMessage,
      originalFilename,
    }
  }
}

// --- Auth Actions ---

export interface AuthActionResponse {
  success: boolean
  message?: string
}

export async function signupAction(
  currentState: AuthActionResponse | undefined,
  formData: FormData
): Promise<AuthActionResponse> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string

  if (!email || !password || !name) {
    return { success: false, message: 'Name, email and password are required.' }
  }

  // Optional: Add server-side validation (e.g., using Zod) here

  try {
    await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
      headers: await headers(),
    })
    console.log('Signup successful via action')
  } catch (error) {
    console.error('Signup Action Error:', error)
    const message =
      error instanceof Error
        ? error.message
        : 'Signup failed. Please try again.'
    return { success: false, message }
  }

  // Redirect on success
  redirect('/')
  // This return is unlikely to be reached due to redirect() throwing an error,
  // but it satisfies TypeScript's requirement for a return path.
  return { success: true }
}

export async function loginAction(
  currentState: AuthActionResponse | undefined,
  formData: FormData
): Promise<AuthActionResponse> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { success: false, message: 'Email and password are required.' }
  }

  try {
    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
      headers: await headers(),
    })
    console.log('Login successful via action')
  } catch (error) {
    console.error('Login Action Error:', error)
    const message =
      error instanceof Error
        ? error.message
        : 'Login failed. Please check your credentials.'
    return { success: false, message }
  }

  redirect('/')
}

export async function logoutAction() {
  'use server'
  try {
    await auth.api.signOut({ headers: await headers() })
    console.log('Logout successful')
  } catch (error) {
    console.error('Logout Action Error:', error)
  }
  redirect('/login')
}
