'use client'

import { createSupabaseBrowserClient } from "@/lib/supabase-browser"

export default function SignInPage() {
  const supabase = createSupabaseBrowserClient()

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:3000/auth/callback',
      },
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-sm border border-gray-200 rounded-lg shadow-sm p-6 sm:p-8">

        {/* App Identity */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-semibold text-gray-900">
            HustleHub
          </h1>
          <p className="text-sm text-gray-500 mt-2 leading-relaxed">
            A simple marketplace to buy and sell services
          </p>
        </div>

        {/* Google OAuth Button */}
        <button
          onClick={signInWithGoogle}
          aria-label="Sign in with Google"
          className="
            h-12 w-full
            border border-gray-300
            rounded-md
            flex items-center justify-center gap-3
            font-medium text-gray-900
            hover:bg-gray-50
            focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2
          "
        >
          Continue with Google
        </button>

        {/* Optional Footer */}
        <p className="text-xs text-gray-400 text-center mt-6">
          By continuing, you agree to our Terms & Privacy Policy
        </p>

      </div>
    </div>
  )
}