import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-xl">
        <h1 className="text-4xl font-extrabold text-blue-600">404</h1>
        <h2 className="text-xl font-bold text-slate-900">Page Not Found</h2>
        <p className="text-xs text-slate-500">The page or resource you are looking for does not exist.</p>
        <Link href="/dashboard" className="inline-block px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700">
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
