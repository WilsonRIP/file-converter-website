'use client'

import Link from 'next/link'
import { useFormState, useFormStatus } from 'react-dom'
import { signupAction } from '../actions' // Import the signup action

function SignupButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      className="mt-4 w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50 dark:focus:ring-offset-gray-800"
      disabled={pending}
      aria-disabled={pending}
    >
      {pending ? 'Signing up...' : 'Sign Up'}
    </button>
  )
}

export default function SignupPage() {
  const [state, formAction] = useFormState(signupAction, undefined)

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
        <h1 className="text-center text-2xl font-bold text-gray-900 dark:text-white">
          Create Account
        </h1>
        <form action={formAction} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
              placeholder="Your Name"
            />
            {/* Display name errors if any - adjust based on server action response structure if needed */}
            {/* {state?.errors?.name && <p className="text-sm text-red-600">{state.errors.name}</p>} */}
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
              placeholder="you@example.com"
            />
            {/* {state?.errors?.email && <p className="text-sm text-red-600">{state.errors.email}</p>} */}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
              placeholder="Create a password"
            />
            {/* {state?.errors?.password && <p className="text-sm text-red-600">{state.errors.password}</p>} */}
          </div>

          {/* Display general signup errors */}
          {state?.message && (
            <div
              className="text-sm text-red-600 dark:text-red-400"
              role="alert"
            >
              {state.message}
            </div>
          )}

          <SignupButton />
        </form>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
