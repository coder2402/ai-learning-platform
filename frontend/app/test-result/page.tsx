'use client'

import Layout from '../../src/components/Layout'
import Link from 'next/link'
import { Trophy, CheckCircle, XCircle, ArrowRight, RotateCcw } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function TestResult() {
  const [result, setResult] = useState<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('lastTestResult')
      if (stored) {
        try { setResult(JSON.parse(stored)) } catch (e) {}
      }
    }
  }, [])

  const score = result?.score ?? 32
  const total = result?.total_marks ?? 40
  const correct = result?.correct ?? 8
  const totalQ = result?.total_questions ?? 10

  return (
    <Layout>
      <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-6 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <Trophy size={32} />
          </div>

          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Test Completed Successfully!</h1>
            <p className="text-xs text-slate-500 mt-1">Calculus Diagnostic Exam</p>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 grid grid-cols-3 gap-4">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Score</p>
              <p className="text-2xl font-extrabold text-blue-600 mt-1">{score} / {total}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Accuracy</p>
              <p className="text-2xl font-extrabold text-emerald-600 mt-1">{Math.round((correct / totalQ) * 100)}%</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Correct</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">{correct} / {totalQ}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link href="/solution-review" className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2">
              Review Solutions (On-Demand AI) <ArrowRight size={14} />
            </Link>
            <Link href="/test-generator" className="py-3 px-5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2">
              <RotateCcw size={14} /> Take Another Test
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  )
}
