import { betterAuth } from 'better-auth'
import * as dotenv from 'dotenv'
import { nextCookies } from 'better-auth/next-js' // Import nextCookies plugin
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from './db' // Import your Drizzle instance
import * as schema from './db/schema' // Import your Drizzle schema

dotenv.config({ path: '.env.local' })

if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error('BETTER_AUTH_SECRET environment variable is required')
}

if (!process.env.BETTER_AUTH_URL) {
  // Default to localhost for development if not set
  console.warn('BETTER_AUTH_URL not set, defaulting to http://localhost:3000')
  process.env.BETTER_AUTH_URL = 'http://localhost:3000'
}

// const DATABASE_URL = process.env.DATABASE_URL; // No longer needed directly here
// if (!DATABASE_URL) {
//   throw new Error(
//     'Please define the DATABASE_URL environment variable inside .env.local'
//   )
// }

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseUrl: process.env.BETTER_AUTH_URL,
  // emailAndPassword: { enabled: true }, // Example: Enable email/password
  // socialProviders: { ... } // Example: Configure social logins
  database: drizzleAdapter(db, {
    provider: 'pg', // Specify PostgreSQL
    schema: schema, // Pass the imported schema
    usePlural: true, // Use plural table names like 'users'
  }),
  // Add other providers or plugins here later if needed
  // e.g., plugins: [organization(), twoFactor()]
  plugins: [
    // Add other plugins here if needed
    nextCookies(), // Handles cookies for Next.js server actions
  ],
})

// We will need to configure a database adapter here later.
// e.g., using drizzleAdapter
