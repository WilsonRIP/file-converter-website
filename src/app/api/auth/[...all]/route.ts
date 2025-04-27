import { auth } from '@/lib/auth' // Assuming your auth instance is at src/lib/auth.ts
import { toNextJsHandler } from 'better-auth/next-js'

// Mount the better-auth handler
export const { GET, POST } = toNextJsHandler(auth.handler)
