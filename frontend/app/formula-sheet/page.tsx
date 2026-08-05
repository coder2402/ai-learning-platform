'use client'

import Layout from '../../src/components/Layout'
import { useState, useEffect } from 'react'
import { FileText, Download, Bookmark } from 'lucide-react'
import { api } from '../../src/services/api'

export default function FormulaSheet() {
  const [selectedTopic, setSelectedTopic] = useState('Calculus')
  const [formulaData, setFormulaData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const topicsList = ['Calculus', 'Algebra', 'Coordinate Geometry', 'Vectors & 3D', 'Trigonometry', 'Probability']

  useEffect(() => {
    async function loadFormulas() {
      setLoading(true)
      try {
        const data = await api.getFormulas(selectedTopic)
        setFormulaData(data)
      } catch (err) {
        setFormulaData(null)
      } finally {
        setLoading(false)
      }
    }
    loadFormulas()
  }, [selectedTopic])

  const formulae = formulaData?.formulae || [
    "∫ dx/(x²+a²) = (1/a) arctan(x/a) + C",
    "∫_0^(π/2) ln(sin x)dx = −(π/2) ln 2",
    "d/dx (x^n) = n x^(n-1)"
  ]

  const identities = formulaData?.identities || [
    "sin²x + cos²x = 1",
    "e^(iπ) + 1 = 0",
    "2 sin x cos x = sin 2x"
  ]

  return (
    <Layout>
      <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Formula Sheets & Short Notes</h1>
            <p className="text-xs text-slate-500 mt-0.5">{selectedTopic} · Quick Revision Guide</p>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            {topicsList.map(t => (
              <button
                key={t}
                onClick={() => setSelectedTopic(t)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedTopic === t
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {t}
              </button>
            ))}
            <button
              onClick={() => typeof window !== 'undefined' && window.print()}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Download size={13} /> PDF
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-[11px]">
            Important Formulae {loading && <span className="text-xs text-purple-600 font-normal">(Loading...)</span>}
          </h2>
          {formulae.map((expr: string, idx: number) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Formula #{idx + 1}</span>
                <Bookmark className="w-4 h-4 text-slate-400 hover:text-purple-600 cursor-pointer" />
              </div>
              <div className="bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 font-mono text-sm text-purple-700 font-bold text-center">
                {expr}
              </div>
            </div>
          ))}

          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-[11px] pt-4">
            Key Identities
          </h2>
          {identities.map((expr: string, idx: number) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Identity #{idx + 1}</span>
                <Bookmark className="w-4 h-4 text-slate-400 hover:text-blue-600 cursor-pointer" />
              </div>
              <div className="bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 font-mono text-sm text-blue-700 font-bold text-center">
                {expr}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
