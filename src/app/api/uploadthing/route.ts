import { createRouteHandler } from 'uploadthing/next'

import { ourFileRouter } from '../../lib/uploadthing'

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  // Apply specific configuration options here
  // config: { ... },
})
