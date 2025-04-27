import { createAuthClient } from 'better-auth/react'

// Create the client instance
// The baseURL can be omitted if the auth server runs on the same domain/port
export const authClient = createAuthClient({
  // baseURL: process.env.NEXT_PUBLIC_AUTH_BASE_URL // Optional: If auth API is elsewhere
})

// You can also export specific methods if preferred:
// export const { signIn, signUp, signOut, useSession } = authClient;
