'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Flag, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { api } from '../../src/services/api'

type QStatus = 'unanswered' | 'answered' | 'marked' | 'answered-marked'

const fallbackQuestions = [
  {
    id: 1,
    topic: 'Definite Integration',
    preamble: 'Let f : ℝ → ℝ be a continuous function satisfying the integral equation:',
    math: '∫₀ˣ f(t) dt = x + ∫ₓ¹ t · f(t) dt',
    stem: 'Find the value of f(1).',
    options: ['A)  1/2', 'B)  2/3', 'C)  1', 'D)  2'],
    correct: 'C)  1',
    marks: '+4 / −1',
  },
  {
    id: 2,
    topic: "King's Property",
    preamble: 'Evaluate the definite integral using symmetry properties:',
    math: '∫₀^(π/2) ln(sin x) dx',
    stem: 'Choose the correct value.',
    options: ['A)  −(π/2) ln 2', 'B)  (π/2) ln 2', 'C)  −π ln 2', 'D)  π ln 2'],
    correct: 'A)  −(π/2) ln 2',
    marks: '+4 / −1',
  },
]

export default function TestInterface() {
  const router = useRouter()
  const TOTAL_SECS = 30 * 60
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECS)
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<Record<number, number>>({})
  const [status, setStatus] = useState<Record<number, QStatus>>({})
  const [showConfirm, setShowConfirm] = useState(false)
  const [testData, setTestData] = useState<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('activeTest')
      if (stored) {
        try { setTestData(JSON.parse(stored)) } catch (e) {}
      }
    }
  }, [])

  useEffect(() => {
    const t = setInterval(() => setTimeLeft(p => Math.max(0, p - 1)), 1000)
    return () => clearInterval(t)
  }, [])

  const questions = testData?.questions || fallbackQuestions
  const q = questions[current] || questions[0]

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0')
  const secs = String(timeLeft % 60).padStart(2, '0')
  const urgent = timeLeft < 300

  const handleSelect = (oi: number) => {
    setSelected(prev => ({ ...prev, [current]: oi }))
    setStatus(prev => {
      const cur = prev[current]
      return { ...prev, [current]: cur === 'marked' || cur === 'answered-marked' ? 'answered-marked' : 'answered' }
    })
  }

  const handleMark = () => {
    setStatus(prev => {
      const cur = prev[current]
      if (cur === 'marked') return { ...prev, [current]: 'unanswered' }
      if (cur === 'answered') return { ...prev, [current]: 'answered-marked' }
      if (cur === 'answered-marked') return { ...prev, [current]: 'answered' }
      return { ...prev, [current]: 'marked' }
    })
  }

  const saveAndNext = () => {
    if (current < questions.length - 1) setCurrent(prev => prev + 1)
  }

  const handleSubmit = async () => {
    if (testData?.test_id) {
      try {
        const answersPayload: Record<number, string> = {}
        Object.entries(selected).forEach(([idx, optIdx]) => {
          const questionObj = questions[Number(idx)]
          if (questionObj) {
            answersPayload[questionObj.id] = questionObj.options[optIdx]
          }
        })
        const res = await api.submitTest(testData.test_id, answersPayload)
        if (typeof window !== 'undefined') {
          localStorage.setItem('lastTestResult', JSON.stringify(res))
        }
      } catch (e) {}
    }
    router.push('/test-result')
  }

  const answered = Object.values(status).filter(s => s === 'answered' || s === 'answered-marked').length
  const markedOnly = Object.values(status).filter(s => s === 'marked').length

  const paletteColor = (i: number): string => {
    const s = status[i] ?? 'unanswered'
    if (i === current) return 'bg-blue-600 text-white ring-2 ring-white ring-offset-1 ring-offset-slate-900'
    if (s === 'answered') return 'bg-emerald-600 text-white'
    if (s === 'answered-marked') return 'bg-purple-600 text-white'
    if (s === 'marked') return 'bg-amber-600 text-white'
    return 'bg-slate-700 text-slate-300 hover:bg-slate-600'
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div className="sticky top-0 z-20 bg-slate-900 border-b border-slate-800 px-4 sm:px-8 py-4 flex justify-between items-center">
        <div>
          <h2 className="text-base font-bold text-white">{testData?.topic || 'Calculus'} Diagnostic Test</h2>
          <p className="text-xs text-slate-400">JEE Advanced Standard · Section 1 (Single Correct)</p>
        </div>
        <div className="flex items-center gap-4">
          <div className={`border px-4 py-2 rounded-xl text-center ${urgent ? 'border-red-500 bg-red-900/30' : 'border-slate-700 bg-slate-800'}`}>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block tracking-wider">Time Remaining</span>
            <span className={`text-lg font-mono font-bold ${urgent ? 'text-red-400' : 'text-emerald-400'}`}>
              {mins}:{secs}
            </span>
          </div>
          <button
            onClick={() => setShowConfirm(true)}
            className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all"
          >
            Submit Test
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-slate-800/80 border border-slate-700 rounded-2xl p-6 space-y-6">
            <div className="flex justify-between items-center text-xs text-slate-400 border-b border-slate-700 pb-3">
              <span>Question {current + 1} of {questions.length}</span>
              <div className="flex items-center gap-3">
                <span className="text-blue-300 font-medium">{q.topic}</span>
                <span className="text-emerald-400 font-semibold font-mono">{q.marks}</span>
              </div>
            </div>

            <div className="space-y-4 text-sm leading-relaxed">
              {q.preamble && <p className="font-medium text-slate-100">{q.preamble}</p>}
              {q.math_expr && (
                <div className="bg-slate-900 p-4 rounded-xl text-center font-mono text-base border border-slate-800 text-blue-200">
                  {q.math_expr}
                </div>
              )}
              {q.stem && <p className="font-medium text-slate-100">{q.stem}</p>}
            </div>

            <div className="space-y-2.5 pt-2">
              {q.options?.map((opt: string, oi: number) => {
                const isSel = selected[current] === oi
                return (
                  <label
                    key={oi}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSel
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-slate-700 hover:bg-slate-700/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q${current}`}
                      checked={isSel}
                      onChange={() => handleSelect(oi)}
                      className="accent-blue-500 w-4 h-4 flex-shrink-0"
                    />
                    <span className={`text-sm font-mono ${isSel ? 'text-blue-300' : 'text-slate-200'}`}>{opt}</span>
                  </label>
                )
              })}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-700">
              <button
                onClick={handleMark}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  status[current] === 'marked' || status[current] === 'answered-marked'
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                }`}
              >
                <Flag className="w-3.5 h-3.5 inline mr-1.5" />
                {status[current] === 'marked' || status[current] === 'answered-marked' ? 'Marked' : 'Mark for Review'}
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrent(p => Math.max(0, p - 1))}
                  disabled={current === 0}
                  className="flex items-center gap-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-xs font-semibold disabled:opacity-40 transition-all"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Previous
                </button>
                <button
                  onClick={saveAndNext}
                  disabled={current === questions.length - 1}
                  className="flex items-center gap-1 px-5 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-semibold disabled:opacity-40 transition-all"
                >
                  Save & Next <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Question Palette</h3>
              <div className="grid grid-cols-5 gap-2">
                {questions.map((_: any, i: number) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`h-9 rounded-lg text-xs font-bold transition-all ${paletteColor(i)}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <div className="space-y-1.5 text-[10px] pt-2 border-t border-slate-700">
                {[
                  { color: 'bg-emerald-600', label: `Answered (${answered})` },
                  { color: 'bg-amber-600', label: `Marked for Review (${markedOnly})` },
                  { color: 'bg-purple-600', label: 'Answered & Marked' },
                  { color: 'bg-slate-700', label: `Not Attempted (${questions.length - answered - markedOnly})` },
                ].map(({ color, label }) => (
                  <div key={label} className="flex items-center gap-2 text-slate-400">
                    <div className={`w-4 h-4 rounded ${color} flex-shrink-0`} />
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl space-y-5">
            <div className="flex items-start justify-between">
              <h3 className="font-bold text-white">Submit Test?</h3>
              <button onClick={() => setShowConfirm(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2.5">
              {[
                { label: 'Answered', val: answered, color: 'text-emerald-400' },
                { label: 'Marked for Review', val: markedOnly, color: 'text-amber-400' },
                { label: 'Not Attempted', val: questions.length - answered - markedOnly, color: 'text-rose-400' },
              ].map(({ label, val, color }) => (
                <div key={label} className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">{label}</span>
                  <span className={`font-bold ${color}`}>{val}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 border border-slate-600 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-700 transition-all">
                Cancel
              </button>
              <button onClick={handleSubmit}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-semibold transition-all">
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
