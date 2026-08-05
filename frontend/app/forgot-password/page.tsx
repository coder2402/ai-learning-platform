'use client'

import { useState } from 'react'
import Link from 'next/link'
import { api } from '../../src/services/api'
import { KeyRound, ArrowLeft, CheckCircle2 } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      await api.forgotPassword(email)
    } catch (e) {}
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-md w-full shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-100">
            <KeyRound size={24} />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Reset Your Password</h1>
          <p className="text-xs text-slate-500">Enter your student email address to receive password recovery instructions</p>
        </div>

        {submitted ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center space-y-3">
            <CheckCircle2 size={32} className="text-emerald-600 mx-auto" />
            <p className="text-xs font-semibold text-emerald-800">
              If an account associated with {email} exists, password reset instructions have been sent.
            </p>
            <Link href="/login" className="inline-block pt-2 text-xs font-bold text-blue-600 hover:underline">
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-600 uppercase tracking-wider mb-1">Registered Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
                placeholder="student@math.com"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              {loading ? 'Sending Request...' : 'Send Recovery Link'}
            </button>
          </form>
        )}

        <div className="text-center pt-2 border-t border-slate-100">
          <Link href="/login" className="text-xs text-slate-500 hover:text-slate-900 font-medium inline-flex items-center gap-1.5">
            <ArrowLeft size={14} /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
