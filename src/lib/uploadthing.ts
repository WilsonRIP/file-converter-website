import { createUploadthing, type FileRouter } from 'uploadthing/next'

const f = createUploadthing()

// FileRouter for your app, can contain multiple FileRoutes
// We might not use this directly for server-side uploads from the action,
// but it's standard setup for UploadThing.
// We'll define a route for potential client-side uploads or reference.
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: {
      maxFileSize: '16MB', // Use allowed value (closest > 10MB)
      // Add more allowed types if needed for intermediate steps, though conversion handles input variety
      contentDisposition: 'inline', // Ensures browser attempts to display file inline
    },
  })
    // Keep the callback simple if primarily uploading from server action
    .onUploadComplete(async ({ file }) => {
      console.log('(ImageUploader) Upload complete for file:', file.ufsUrl)
      return { url: file.ufsUrl } // Return the new URL field
    }),

  // Route specifically for the results of conversions (server-side upload)
  // We might use this permission model if we integrate auth later.
  // For now, it acts as a placeholder configuration.
  convertedImageOutput: f({
    image: {
      maxFileSize: '16MB', // Allow larger size for potentially complex conversions
      contentDisposition: 'attachment', // Ensures browser prompts download
    },
  }).onUploadComplete(async ({ file }) => {
    console.log('(ConvertedOutput) Upload complete for file:', file.ufsUrl)
    return { url: file.ufsUrl } // Return the new URL field
  }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
