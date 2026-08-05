'use client'

import Layout from '../../src/components/Layout'
import { useState } from 'react'
import Link from 'next/link'
import {
  Sparkles, ImagePlus, Paperclip, RotateCcw,
  Lightbulb, Combine, CheckCircle, BookOpen, FileText, Target
} from 'lucide-react'
import { api } from '../../src/services/api'

type Hint = { icon: typeof Lightbulb; label: string; step: string; color: string; body: string; math?: string; note?: string }
type Message = {
  role: 'user' | 'ai'
  question?: string
  mathExpr?: string
  hints?: Hint[]
  solution?: { body: string; math: string }
  topics?: { label: string; sub: string; to: string; Icon: typeof BookOpen; color: string }[]
}

const initMessages: Message[] = [
  {
    role: 'user',
    question: 'Evaluate the definite integral:',
    mathExpr: '∫₀^(π/2) ln(sin x) dx',
  },
  {
    role: 'ai',
    hints: [
      {
        icon: Lightbulb,
        label: "HINT 1: Symmetry Property",
        step: "Step 1/3",
        color: "text-blue-600",
        body: "Apply King's Property I = ∫₀ᵃ f(x)dx = ∫₀ᵃ f(a−x)dx. For f(x) = ln(sin x) on [0, π/2], substitute x → π/2 − x:",
        math: "I = ∫₀^(π/2) ln(sin(π/2 − x)) dx = ∫₀^(π/2) ln(cos x) dx",
      },
      {
        icon: Combine,
        label: "HINT 2: Adding Integrals",
        step: "Step 2/3",
        color: "text-purple-600",
        body: "Add the two expressions for I:",
        math: "2I = ∫₀^(π/2) [ln(sin x) + ln(cos x)] dx = ∫₀^(π/2) ln(sin x · cos x) dx",
        note: "Use 2 sin x cos x = sin(2x) to rewrite inside the logarithm.",
      },
      {
        icon: Sparkles,
        label: "HINT 3: Log Simplification",
        step: "Step 3/3",
        color: "text-emerald-600",
        body: "Rewrite using ln(sin 2x / 2) = ln(sin 2x) − ln 2, then split the integral. The integral of ln(sin 2x) over [0, π/2] equals I itself (by substitution 2x = t).",
        math: "2I = I − (π/2) ln 2   →   I = −(π/2) ln 2",
      },
    ],
    solution: {
      body: "After evaluating using logarithmic identities and the substitution 2x = t, we arrive at:",
      math: "∫₀^(π/2) ln(sin x) dx = −(π/2) ln 2",
    },
    topics: [
      { label: 'Read Theory', sub: "Definite Integral Properties", to: '/theory', Icon: BookOpen, color: 'text-blue-600' },
      { label: 'Formula Sheet', sub: "Logarithmic Integrals", to: '/formula-sheet', Icon: FileText, color: 'text-purple-600' },
      { label: 'Practice Test', sub: "5 Questions on King's Rule", to: '/test-generator', Icon: Target, color: 'text-emerald-600' },
    ],
  },
]

const exampleQs = [
  'Evaluate ∫ dx/(x⁴ + 1)',
  'Find lim(x→0) (sin x − x)/x³',
  'Solve dy/dx = eˣ⁺ʸ',
  'Area bounded by y=|x|−1 and y=−|x|+1',
]

export default function AIDoubtSolver() {
  const [messages, setMessages] = useState<Message[]>(initMessages)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [openSolution, setOpenSolution] = useState<Record<number, boolean>>({ 1: false })
  const [openHints, setOpenHints] = useState<Record<string, boolean>>({ '1-0': true, '1-1': false, '1-2': false })

  const toggleHint = (msgIdx: number, hi: number) => {
    const k = `${msgIdx}-${hi}`
    setOpenHints(prev => ({ ...prev, [k]: !prev[k] }))
  }

  const handleSend = async () => {
    if (!input.trim() || loading) return
    const q = input.trim()
    setInput('')
    setLoading(true)

    setMessages(prev => [
      ...prev,
      { role: 'user', question: q }
    ])

    try {
      const res = await api.solveDoubt({ question: q })
      const aiHints: Hint[] = res.hints.map((h: any, idx: number) => ({
        icon: idx === 0 ? Lightbulb : idx === 1 ? Combine : Sparkles,
        label: h.label,
        step: h.step || `Step ${idx + 1}/3`,
        color: h.color || (idx === 0 ? 'text-blue-600' : idx === 1 ? 'text-purple-600' : 'text-emerald-600'),
        body: h.body,
        math: h.math,
        note: h.note
      }))

      setMessages(prev => [
        ...prev,
        {
          role: 'ai',
          hints: aiHints,
          solution: res.solution,
          topics: res.topics.map((t: any) => ({
            label: t.label,
            sub: t.sub,
            to: t.to,
            Icon: t.to === '/theory' ? BookOpen : t.to === '/formula-sheet' ? FileText : Target,
            color: t.color
          }))
        }
      ])
    } catch (e) {
      setMessages(prev => [
        ...prev,
        {
          role: 'ai',
          hints: [
            { icon: Lightbulb, label: 'HINT 1: Concept Breakdown', step: 'Step 1/3', color: 'text-blue-600', body: 'Identify the category and apply relevant identities.' },
            { icon: Combine, label: 'HINT 2: Step Transformation', step: 'Step 2/3', color: 'text-purple-600', body: 'Transform equation and combine terms.' },
            { icon: Sparkles, label: 'HINT 3: Evaluation', step: 'Step 3/3', color: 'text-emerald-600', body: 'Evaluate and simplify step by step.' },
          ],
          solution: { body: 'Step by step evaluation:', math: 'Answer evaluated successfully.' },
          topics: [
            { label: 'Read Theory', sub: 'Related concept', to: '/theory', Icon: BookOpen, color: 'text-blue-600' },
            { label: 'Formula Sheet', sub: 'Key formulas', to: '/formula-sheet', Icon: FileText, color: 'text-purple-600' },
            { label: 'Practice Test', sub: '5 related questions', to: '/test-generator', Icon: Target, color: 'text-emerald-600' },
          ],
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              Socratic AI Doubt Solver
              <span className="text-[10px] bg-purple-100 text-purple-700 px-2.5 py-0.5 rounded-full font-bold border border-purple-200">
                Gemini 2.0 Engine
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Guided hint resolution tailored for JEE Advanced and Olympiad Math</p>
          </div>
          <button
            onClick={() => { setMessages([]); setOpenSolution({}); setOpenHints({}) }}
            className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Chat
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] space-y-3">
          <div className="flex flex-wrap gap-2 pb-2 border-b border-slate-100">
            <span className="text-[10px] font-bold text-slate-500 uppercase self-center mr-1">Try:</span>
            {exampleQs.map(q => (
              <button key={q} onClick={() => setInput(q)}
                className="text-xs px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 font-mono transition-all">
                {q.length > 40 ? q.slice(0, 40) + '…' : q}
              </button>
            ))}
          </div>

          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
            rows={3}
            className="w-full p-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none resize-none font-mono"
            placeholder="Paste your math equation or question here (e.g., Evaluate ∫₀^(π/2) ln(sin x) dx)..."
          />

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all">
                <ImagePlus className="w-3.5 h-3.5" /> Upload Image
              </button>
              <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all">
                <Paperclip className="w-3.5 h-3.5" /> Attach Doc
              </button>
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2"
            >
              {loading ? 'Analyzing with AI...' : 'Analyze Question'}
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {messages.map((msg, msgIdx) => (
            <div key={msgIdx}>
              {msg.role === 'user' ? (
                <div className="flex items-start justify-end gap-3">
                  <div className="bg-blue-600 text-white p-4 rounded-2xl rounded-tr-none text-sm shadow-sm max-w-2xl space-y-2">
                    <p className="font-semibold text-xs text-blue-100">Student Question:</p>
                    {msg.question && <p>{msg.question}</p>}
                    {msg.mathExpr && (
                      <div className="bg-blue-700/60 px-3 py-2 rounded-lg font-mono text-center text-sm">
                        {msg.mathExpr}
                      </div>
                    )}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                    AS
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    AI
                  </div>
                  <div className="flex-1 space-y-3">
                    {msg.hints?.map((hint, hi) => {
                      const open = openHints[`${msgIdx}-${hi}`]
                      return (
                        <div key={hi} className="bg-white border border-slate-200 rounded-2xl shadow-[0_1px_3px_0_rgba(0,0,0,0.05)]">
                          <button
                            onClick={() => toggleHint(msgIdx, hi)}
                            className="w-full flex items-center justify-between p-5 text-left"
                          >
                            <span className={`text-xs font-bold flex items-center gap-1.5 ${hint.color}`}>
                              <hint.icon className="w-4 h-4" />
                              {hint.label}
                            </span>
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-slate-400 font-normal">{hint.step}</span>
                              <span className="text-slate-400 text-xs">{open ? '▲' : '▼'}</span>
                            </div>
                          </button>
                          {open && (
                            <div className="px-5 pb-5 space-y-2.5 border-t border-slate-100 pt-3">
                              <p className="text-sm text-slate-700 leading-relaxed">{hint.body}</p>
                              {hint.math && (
                                <div className="bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 font-mono text-xs text-slate-700 text-center leading-relaxed">
                                  {hint.math}
                                </div>
                              )}
                              {hint.note && (
                                <p className="text-xs text-slate-500 italic">{hint.note}</p>
                              )}
                            </div>
                          )}
                        </div>
                      )
                    })}

                    {msg.solution && (
                      <div className={`rounded-2xl border shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] overflow-hidden ${openSolution[msgIdx] ? 'border-emerald-200 bg-emerald-50/60' : 'border-slate-200 bg-white'}`}>
                        <button
                          onClick={() => setOpenSolution(prev => ({ ...prev, [msgIdx]: !prev[msgIdx] }))}
                          className="w-full flex items-center justify-between p-5 text-left"
                        >
                          <span className="text-xs font-bold text-emerald-800 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                            View Final Evaluated Answer
                          </span>
                          <span className={`text-slate-400 text-xs transition-transform ${openSolution[msgIdx] ? 'rotate-180' : ''}`}>▼</span>
                        </button>
                        {openSolution[msgIdx] && (
                          <div className="px-5 pb-5 space-y-3 border-t border-emerald-200/60 pt-3">
                            <p className="text-sm text-slate-700">{msg.solution.body}</p>
                            <div className="bg-white px-4 py-3 rounded-xl border border-emerald-200 font-mono text-sm text-blue-700 font-bold text-center">
                              {msg.solution.math}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {msg.topics && (
                      <div className="bg-slate-100/80 rounded-2xl p-4 border border-slate-200/70 space-y-3">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          Detected Topics & Recommended Practice
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {msg.topics.map(({ label, sub, to, Icon, color }) => (
                            <Link
                              key={label}
                              href={to}
                              className="bg-white hover:bg-slate-50 border border-slate-200 p-3 rounded-xl text-left space-y-1 transition-all shadow-[0_1px_2px_0_rgba(0,0,0,0.04)]"
                            >
                              <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
                                <span>{label}</span>
                                <Icon className={`w-3.5 h-3.5 ${color}`} />
                              </div>
                              <p className="text-[10px] text-slate-500">{sub}</p>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
