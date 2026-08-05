'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { api } from '../../src/services/api'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await api.login({ email, password })
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', res.access_token)
      }
      router.push('/dashboard')
    } catch (err: any) {
      setError('Invalid credentials or server unavailable. Continuing in demo mode.')
      setTimeout(() => router.push('/dashboard'), 1000)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-md w-full shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-blue-500/20 mx-auto">
            Σ
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Student Sign In</h1>
          <p className="text-xs text-slate-500">Access your Socratic AI doubts, tests, and analytics</p>
        </div>

        {error && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs p-3 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-600 uppercase tracking-wider mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              placeholder="student@math.com"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-600 uppercase tracking-wider mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all">
            Sign In to Platform
          </button>
        </form>

        <p className="text-xs text-center text-slate-500">
          Don&apos;t have an account? <Link href="/register" className="text-blue-600 font-bold hover:underline">Register free</Link>
        </p>
      </div>
    </div>
  )
}
