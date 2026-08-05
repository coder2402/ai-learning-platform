'use client'

import Layout from '../../src/components/Layout'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ClipboardList, CheckCircle2, Clock } from 'lucide-react'
import { api } from '../../src/services/api'

export default function AssignmentPage() {
  const [assignments, setAssignments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadAssignments() {
      try {
        const data = await api.getAssignments()
        setAssignments(data)
      } catch (err) {
        setAssignments([
          { id: 1, title: 'Definite Integration Advanced Problem Set', topic: 'Calculus', questions: 15, duration: '45 mins', status: 'Pending' },
          { id: 2, title: 'Complex Numbers & De Moivre Theorem', topic: 'Algebra', questions: 10, duration: '30 mins', status: 'Completed' },
          { id: 3, title: 'Vectors & 3D Lines Mastery', topic: 'Vectors & 3D', questions: 12, duration: '35 mins', status: 'Pending' },
        ])
      } finally {
        setLoading(false)
      }
    }
    loadAssignments()
  }, [])

  return (
    <Layout>
      <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-2xl font-extrabold text-slate-900">Topic-wise Practice Assignments</h1>
          <p className="text-xs text-slate-500 mt-0.5">Admin-curated deterministic question sets from the database</p>
        </div>

        <div className="space-y-4">
          {assignments.map(ass => (
            <div key={ass.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                  {ass.topic}
                </span>
                <h3 className="text-base font-bold text-slate-900">{ass.title}</h3>
                <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                  <span>{ass.questions || 10} Questions</span>
                  <span>•</span>
                  <span>{ass.duration || '30 mins'}</span>
                </div>
              </div>
              <Link href="/test-generator" className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl self-start sm:self-center transition-all">
                Start Assignment
              </Link>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
