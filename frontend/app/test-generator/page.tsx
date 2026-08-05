'use client'

import Layout from '../../src/components/Layout'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, ChevronDown, AlertCircle } from 'lucide-react'
import { api } from '../../src/services/api'

const topicsMap: Record<string, string[]> = {
  Calculus: ['Limits & Continuity', 'Differentiation', 'Application of Derivatives', 'Indefinite Integration', 'Definite Integration', 'Differential Equations'],
  Algebra: ['Quadratic Equations', 'Sequences & Series', 'Binomial Theorem', 'Complex Numbers', 'Matrices & Determinants', 'Permutations & Combinations'],
  'Coordinate Geometry': ['Straight Lines', 'Circles', 'Parabola', 'Ellipse', 'Hyperbola'],
  'Vectors & 3D': ['Vectors Basics', 'Dot & Cross Product', '3D Lines & Planes', 'Coplanarity'],
  Trigonometry: ['Ratios & Identities', 'Equations', 'Inverse Trig Functions', 'Heights & Distances'],
  Probability: ['Basic Probability', 'Bayes Theorem', 'Binomial Distribution', 'Conditional Probability'],
}

const qTypes = [
  { id: 'single', label: 'Single Correct (MCQ)', marks: '+4 / −1' },
  { id: 'multiple', label: 'Multiple Correct (MSQ)', marks: '+4 / −2' },
  { id: 'numerical', label: 'Numerical Answer (Integer)', marks: '+4 / 0' },
  { id: 'short', label: 'Short Answer', marks: '+3 / 0' },
  { id: 'long', label: 'Long Answer', marks: '+5 / 0' },
  { id: 'fill', label: 'Fill in the Blank', marks: '+3 / 0' },
  { id: 'assertion', label: 'Assertion–Reason', marks: '+4 / −1' },
  { id: 'truefalse', label: 'True / False', marks: '+2 / −1' },
  { id: 'match', label: 'Match the Following', marks: '+4 / −1' },
]

const examPatterns = [
  { id: 'jee-mains', label: 'JEE Mains', tag: 'NTA Pattern' },
  { id: 'jee-advanced', label: 'JEE Advanced', tag: 'IIT Pattern' },
  { id: 'custom', label: 'Custom / Practice', tag: 'No Pattern' },
]

function Select({ label, value, onChange, options }: {
  label: string
  value: string
  onChange: (v: string) => void
  options: string[]
}) {
  return (
    <div>
      <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full appearance-none px-4 py-2.5 pr-9 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 font-medium"
        >
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      </div>
    </div>
  )
}

export default function TestGenerator() {
  const router = useRouter()
  const [topic, setTopic] = useState('Calculus')
  const [subtopic, setSubtopic] = useState('Definite Integration')
  const [pattern, setPattern] = useState('jee-advanced')
  const [qType, setQType] = useState('single')
  const [difficulty, setDifficulty] = useState(2)
  const [numQ, setNumQ] = useState(10)
  const [duration, setDuration] = useState(30)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const diffLabels = ['Easy', 'JEE Mains', 'JEE Advanced']
  const diffColors = ['text-emerald-600 bg-emerald-50', 'text-blue-600 bg-blue-50', 'text-rose-600 bg-rose-50']

  const handleTopicChange = (t: string) => {
    setTopic(t)
    setSubtopic(topicsMap[t][0])
  }

  const handleGenerate = async () => {
    setLoading(true)
    setErrorMsg(null)
    try {
      const res = await api.generateTest({
        topic,
        subtopic,
        pattern,
        question_type: qType,
        difficulty: diffLabels[difficulty - 1],
        num_questions: numQ,
        duration_mins: duration,
      })
      if (typeof window !== 'undefined') {
        localStorage.setItem('activeTest', JSON.stringify(res))
      }
      router.push('/test')
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to generate test. Free plan limits may be reached.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-6 md:p-8 space-y-6" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-2xl font-extrabold text-slate-900">AI Test Paper Generator</h1>
          <p className="text-xs text-slate-500 mt-0.5">Configure customised diagnostic exams based on real exam weightage</p>
        </div>

        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] space-y-6">
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">Exam Pattern</label>
            <div className="grid grid-cols-3 gap-3">
              {examPatterns.map(p => (
                <button
                  key={p.id}
                  onClick={() => setPattern(p.id)}
                  className={`p-3 rounded-xl text-left border-2 transition-all ${
                    pattern === p.id
                      ? 'border-blue-600 bg-blue-50/60'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <p className={`text-xs font-bold ${pattern === p.id ? 'text-blue-700' : 'text-slate-700'}`}>{p.label}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{p.tag}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Subject Module"
              value={topic}
              onChange={handleTopicChange}
              options={Object.keys(topicsMap)}
            />
            <Select
              label="Subtopic / Chapter"
              value={subtopic}
              onChange={setSubtopic}
              options={topicsMap[topic] ?? []}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">Question Type</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {qTypes.map(t => (
                <button
                  key={t.id}
                  onClick={() => setQType(t.id)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl border-2 text-left transition-all ${
                    qType === t.id
                      ? 'border-blue-600 bg-blue-50/60'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span className={`text-xs font-semibold ${qType === t.id ? 'text-blue-800' : 'text-slate-700'}`}>{t.label}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${qType === t.id ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
                    {t.marks}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Target Difficulty Level</label>
              <span className={`text-xs font-bold px-3 py-1 rounded-lg ${diffColors[difficulty - 1]}`}>
                {diffLabels[difficulty - 1]}
              </span>
            </div>
            <input
              type="range" min={1} max={3} value={difficulty}
              onChange={e => setDifficulty(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
              <span>Easy / Practice</span><span>JEE Mains</span><span>JEE Advanced</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Number of Questions <span className="text-slate-400 normal-case font-normal">(Max 25)</span>
              </label>
              <input
                type="number" value={numQ} min={5} max={25}
                onChange={e => setNumQ(Math.min(25, Math.max(1, Number(e.target.value))))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Time Limit <span className="text-slate-400 normal-case font-normal">(Minutes)</span>
              </label>
              <input
                type="number" value={duration} min={5} max={180}
                onChange={e => setDuration(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              />
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 flex flex-wrap gap-3 text-xs">
            {[
              { k: 'Topic', v: `${topic} → ${subtopic}` },
              { k: 'Questions', v: String(numQ) },
              { k: 'Duration', v: `${duration} min` },
              { k: 'Difficulty', v: diffLabels[difficulty - 1] },
              { k: 'Pattern', v: examPatterns.find(p => p.id === pattern)?.label ?? '' },
            ].map(({ k, v }) => (
              <span key={k} className="text-slate-500">
                <span className="font-bold text-slate-700">{k}:</span> {v}
              </span>
            ))}
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {loading ? 'Generating Paper...' : 'Generate & Launch Test Environment'}
          </button>
        </div>
      </div>
    </Layout>
  )
}
