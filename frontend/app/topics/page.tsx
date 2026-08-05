'use client'

import Layout from '../../src/components/Layout'
import Link from 'next/link'
import { BookOpen, Layers } from 'lucide-react'

const topics = [
  { name: 'Calculus', count: '6 Subtopics', desc: 'Limits, Continuity, Differentiation, Definite & Indefinite Integration' },
  { name: 'Algebra', count: '5 Subtopics', desc: 'Quadratic Equations, Sequences & Series, Complex Numbers, Matrices' },
  { name: 'Coordinate Geometry', count: '5 Subtopics', desc: 'Straight Lines, Circles, Parabola, Ellipse, Hyperbola' },
  { name: 'Vectors & 3D', count: '4 Subtopics', desc: 'Vector Algebra, Dot & Cross Product, 3D Lines & Planes' },
]

export default function TopicsPage() {
  return (
    <Layout>
      <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-2xl font-extrabold text-slate-900">Mathematics Topic Modules</h1>
          <p className="text-xs text-slate-500 mt-0.5">Explore theory, formula sheets, and practice tests by subject</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topics.map(t => (
            <div key={t.name} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-slate-900">{t.name}</h3>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">{t.count}</span>
              </div>
              <p className="text-xs text-slate-600">{t.desc}</p>
              <div className="flex gap-2 pt-2">
                <Link href="/theory" className="text-xs font-bold text-blue-600 hover:underline">Read Theory →</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
