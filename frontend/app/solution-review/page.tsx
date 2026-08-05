'use client'

import Layout from '../../src/components/Layout'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CheckCircle, XCircle, ChevronLeft, ChevronRight, BookOpen, FileText, ClipboardList } from 'lucide-react'
import { api } from '../../src/services/api'

const mockSolutions = [
  {
    id: 1,
    q: 'Evaluate: lim(x→0) [sin(2x) / x]',
    studentAnswer: 'B) 2',
    correctAnswer: 'B) 2',
    isCorrect: true,
    steps: [
      'Rewrite: lim(x→0) sin(2x)/x',
      'Multiply and divide by 2: lim(x→0) 2·[sin(2x)/(2x)]',
      'Apply standard limit lim(u→0) sin(u)/u = 1',
      'Answer: 2 · 1 = 2',
    ],
    commonMistake: 'Students often forget to multiply by the coefficient when applying standard limits.',
    topic: 'Limits',
  },
  {
    id: 2,
    q: 'The derivative of f(x) = x·ln(x) is:',
    studentAnswer: 'A) ln(x)',
    correctAnswer: 'B) ln(x) + 1',
    isCorrect: false,
    steps: [
      "Use Product Rule: (uv)' = u'v + uv'",
      "Here u = x, v = ln(x)",
      "u' = 1, v' = 1/x",
      "f'(x) = 1·ln(x) + x·(1/x) = ln(x) + 1",
    ],
    commonMistake: "Forgetting to differentiate v = ln(x) — many students skip the second term in the product rule.",
    topic: 'Differentiation',
  },
]

export default function SolutionReview() {
  const [current, setCurrent] = useState(0)
  const [liveSolution, setLiveSolution] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const sol = liveSolution || mockSolutions[current]

  useEffect(() => {
    async function loadLazySolution() {
      setLoading(true)
      try {
        const data = await api.getSolution(current + 1)
        setLiveSolution(data)
      } catch (e) {
        setLiveSolution(null)
      } finally {
        setLoading(false)
      }
    }
    loadLazySolution()
  }, [current])

  return (
    <Layout>
      <div className="p-5 lg:p-8 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Solution Review
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">Question {current + 1} of {mockSolutions.length}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrent(prev => Math.max(0, prev - 1))}
              disabled={current === 0}
              className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40"
            >
              <ChevronLeft size={14} /> Prev
            </button>
            <button
              onClick={() => setCurrent(prev => Math.min(mockSolutions.length - 1, prev + 1))}
              disabled={current === mockSolutions.length - 1}
              className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-40"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-4">
          <div className="flex items-start gap-3 mb-4">
            <div className={`flex-shrink-0 mt-0.5 ${sol.isCorrect ?? true ? 'text-green-500' : 'text-red-500'}`}>
              {sol.isCorrect ?? true ? <CheckCircle size={20} /> : <XCircle size={20} />}
            </div>
            <p className="font-mono text-gray-900 text-sm leading-relaxed">{sol.question_stem || sol.q}</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div className={`p-3 rounded-xl border ${sol.isCorrect ?? true ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <p className="text-xs font-semibold mb-1 text-gray-500">Your Answer</p>
              <p className={`text-sm font-semibold ${sol.isCorrect ?? true ? 'text-green-700' : 'text-red-700'}`}>
                {sol.studentAnswer || sol.correct_answer || 'Selected Option'}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-green-50 border border-green-200">
              <p className="text-xs font-semibold mb-1 text-gray-500">Correct Answer</p>
              <p className="text-sm font-semibold text-green-700">{sol.correctAnswer || sol.correct_answer}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-4">
          <h2 className="font-bold text-gray-900 mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Step-by-step Solution {loading && <span className="text-xs font-normal text-blue-600">(Generating via Gemini...)</span>}
          </h2>
          <div className="space-y-3">
            {sol.steps?.map((step: string, i: number) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <p className="font-mono text-sm text-gray-700 leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {(sol.common_mistake || sol.commonMistake) && (
          <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 mb-4 flex gap-3">
            <span className="text-orange-500 flex-shrink-0 mt-0.5">⚠️</span>
            <div>
              <p className="text-sm font-semibold text-orange-800 mb-1">Common Mistake</p>
              <p className="text-sm text-orange-700">{sol.common_mistake || sol.commonMistake}</p>
            </div>
          </div>
        )}

        <div className="bg-white border border-gray-100 rounded-2xl p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Resources for {sol.topic}</p>
          <div className="flex gap-2 flex-wrap">
            <Link href="/theory" className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-medium hover:bg-blue-100 border border-blue-100">
              <BookOpen size={14} /> Read Theory
            </Link>
            <Link href="/formula-sheet" className="flex items-center gap-1.5 px-3 py-2 bg-purple-50 text-purple-700 rounded-xl text-sm font-medium hover:bg-purple-100 border border-purple-100">
              <FileText size={14} /> Formula Sheet
            </Link>
            <Link href="/assignments" className="flex items-center gap-1.5 px-3 py-2 bg-green-50 text-green-700 rounded-xl text-sm font-medium hover:bg-green-100 border border-green-100">
              <ClipboardList size={14} /> Practice Assignment
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  )
}
