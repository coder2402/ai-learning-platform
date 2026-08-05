'use client'

import Layout from '../../src/components/Layout'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { FileText, Target, BookOpen } from 'lucide-react'
import { api } from '../../src/services/api'

export default function TheoryPage() {
  const [selectedTopic, setSelectedTopic] = useState('Calculus')
  const [theoryData, setTheoryData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const topicsList = ['Calculus', 'Algebra', 'Coordinate Geometry', 'Vectors & 3D', 'Trigonometry', 'Probability']

  useEffect(() => {
    async function loadTheory() {
      setLoading(true)
      try {
        const data = await api.getTheory(selectedTopic)
        setTheoryData(data)
      } catch (err) {
        setTheoryData(null)
      } finally {
        setLoading(false)
      }
    }
    loadTheory()
  }, [selectedTopic])

  return (
    <Layout>
      <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
        <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Theory & Concept Modules</h1>
            <p className="text-xs text-slate-500 mt-0.5">Comprehensive, deterministic theory notes for JEE & Olympiad Math</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {topicsList.map(t => (
              <button
                key={t}
                onClick={() => setSelectedTopic(t)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedTopic === t
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
              {selectedTopic}
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-2">
              {selectedTopic} Theoretical Foundation {loading && <span className="text-xs text-blue-500 font-normal">(Loading...)</span>}
            </h2>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              {theoryData?.introduction || theoryData?.content || `${selectedTopic} represents a fundamental pillar of competitive mathematics. It possesses powerful algebraic properties that enable solving complex problems.`}
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-[11px]">Key Theoretical Principles</h3>
            
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
              <h4 className="text-xs font-bold text-blue-900">1. Core Theorem & Identity</h4>
              <p className="text-xs text-slate-700 font-mono bg-white p-3 rounded-lg border border-slate-200 text-center">
                {theoryData?.examples?.[0]?.q || "∫_a^b f(x) dx = ∫_a^b f(a + b − x) dx"}
              </p>
              <p className="text-xs text-slate-600">
                {theoryData?.examples?.[0]?.a || "Useful when f(x) contains trigonometric ratios or exponential functions where substituting x → (a + b − x) yields a complementary integrand."}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
              <h4 className="text-xs font-bold text-purple-900">2. Important Notes</h4>
              {theoryData?.important_notes?.map((note: string, idx: number) => (
                <p key={idx} className="text-xs text-slate-700 font-mono bg-white p-2.5 rounded-lg border border-slate-200">
                  • {note}
                </p>
              )) || (
                <p className="text-xs text-slate-700 font-mono bg-white p-2.5 rounded-lg border border-slate-200">
                  • Always check boundary conditions and sign changes carefully.
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-100">
            <Link href="/formula-sheet" className="px-4 py-2.5 bg-purple-50 text-purple-700 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-purple-100 transition-all">
              <FileText size={14} /> Open Formula Sheet
            </Link>
            <Link href="/test-generator" className="px-4 py-2.5 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-emerald-100 transition-all">
              <Target size={14} /> Practice Topic Test
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  )
}
