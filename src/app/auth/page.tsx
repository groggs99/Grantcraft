'use client'

import { use, useActionState, useState } from 'react'
import { signIn, signUp } from './actions'

export default function AuthPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error: urlError } = use(searchParams)
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [signInError, signInAction, signingIn] = useActionState(signIn, null)
  const [signUpError, signUpAction, signingUp] = useActionState(signUp, null)

  const error = urlError ?? (mode === 'signin' ? signInError : signUpError)
  const pending = mode === 'signin' ? signingIn : signingUp
  const action = mode === 'signin' ? signInAction : signUpAction

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 px-4">
      <div className="w-full max-w-sm">
        {/* Branding */}
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600">
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-stone-900">GrantCraft</h1>
          <p className="mt-1 text-sm text-stone-500">
            {mode === 'signin' ? 'Sign in to your account' : 'Create your account'}
          </p>
        </div>

        {/* Card */}
        <div className="rounded-xl border border-stone-200 bg-white p-8 shadow-sm">
          {/* Mode toggle */}
          <div className="mb-6 flex rounded-lg border border-stone-200 p-1">
            <button
              type="button"
              onClick={() => setMode('signin')}
              className={`flex-1 rounded-md py-1.5 text-sm font-medium transition-colors ${
                mode === 'signin'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`flex-1 rounded-md py-1.5 text-sm font-medium transition-colors ${
                mode === 'signup'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              Sign up
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Form */}
          <form action={action} className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-stone-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="form-input"
                placeholder="you@example.ie"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-stone-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                className="form-input"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
            >
              {pending
                ? mode === 'signin' ? 'Signing in…' : 'Creating account…'
                : mode === 'signin' ? 'Sign in' : 'Create account'}
            </button>
          </form>

          {mode === 'signup' && (
            <p className="mt-4 text-center text-xs text-stone-500">
              We may send a confirmation email — check your inbox before signing in.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
