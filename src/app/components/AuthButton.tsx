import Link from 'next/link'
import { auth } from '@/lib/auth' // Use @ alias assuming it's configured
import { headers } from 'next/headers'
import { logoutAction } from '../actions'

async function getUserSession() {
  try {
    // Fetch session on the server
    return await auth.api.getSession({ headers: await headers() })
  } catch (error) {
    console.error('Failed to get user session:', error)
    return null
  }
}

export default async function AuthButton() {
  const session = await getUserSession()

  return (
    <div className="flex items-center gap-4">
      {session ? (
        <>
          <span className="hidden text-sm text-gray-700 sm:inline dark:text-gray-300">
            {session.user?.email ?? 'Logged In'}{' '}
            {/* Display email or fallback */}
          </span>
          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-md bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Logout
            </button>
          </form>
        </>
      ) : (
        <>
          <Link
            href="/login"
            className="rounded-md bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="rounded-md bg-blue-600 px-3 py-1 text-sm font-medium text-white hover:bg-blue-700 dark:hover:bg-blue-500"
          >
            Sign Up
          </Link>
        </>
      )}
    </div>
  )
}
