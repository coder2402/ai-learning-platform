'use client'

import Layout from '../../src/components/Layout'
import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { api } from '../../src/services/api'

export default function PYQPage() {
  const [pyqs, setPyqs] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [selectedTopic, setSelectedTopic] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadPYQs() {
      setLoading(true)
      try {
        const data = await api.getPYQ(selectedTopic || undefined)
        setPyqs(data)
      } catch (err) {
        setPyqs([
          { id: 1, year: 2022, exam: 'JEE Advanced', topic: 'Calculus', stem: 'Evaluate ∫₀^(π/2) ln(sin x) dx', difficulty: 'Hard' },
          { id: 2, year: 2021, exam: 'JEE Mains', topic: 'Algebra', stem: 'Find principal argument of z = (1 + i)⁸', difficulty: 'Medium' },
        ])
      } finally {
        setLoading(false)
      }
    }
    loadPYQs()
  }, [selectedTopic])

  const filteredPYQs = pyqs.filter(item =>
    item.stem.toLowerCase().includes(search.toLowerCase()) ||
    item.topic.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Layout>
      <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-2xl font-extrabold text-slate-900">Previous Year Questions (PYQs)</h1>
          <p className="text-xs text-slate-500 mt-0.5">Filter and practice real JEE Mains & Advanced exam questions</p>
        </div>

        <div className="flex gap-3 flex-col sm:flex-row">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search PYQs by topic or keyword..."
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredPYQs.map(item => (
            <div key={item.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex justify-between items-center text-xs">
                <div className="flex gap-2">
                  <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    {item.exam || 'JEE'} {item.year || 2022}
                  </span>
                  <span className="text-slate-500 font-medium self-center">{item.topic}</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-600">
                  {item.difficulty || 'Medium'}
                </span>
              </div>
              <p className="font-mono text-sm text-slate-900">{item.stem}</p>
              {item.math_expr && (
                <div className="bg-slate-50 p-3 rounded-lg font-mono text-xs text-blue-800 border border-slate-100">
                  {item.math_expr}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
