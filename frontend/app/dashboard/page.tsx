'use client'

import Layout from '../../src/components/Layout'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import {
  Sparkles, Award, Clock, ArrowUpRight, BookOpen, FileText, Target
} from 'lucide-react'
import { api } from '../../src/services/api'

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<any>(null)

  useEffect(() => {
    async function loadDashboard() {
      try {
        const data = await api.getDashboard()
        setDashboardData(data)
      } catch (err) {
        setDashboardData(null)
      }
    }
    loadDashboard()
  }, [])

  const userName = dashboardData?.user_name || 'Alex Sharma'
  const plan = dashboardData?.plan || 'free'
  const stats = dashboardData?.stats || { doubts_solved: 24, tests_attempted: 8, assignments_completed: 12, accuracy_percent: 84 }

  return (
    <Layout>
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-6 md:p-8 rounded-3xl text-white shadow-xl">
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 bg-blue-500/20 text-blue-300 rounded-full border border-blue-400/20">
              {plan.toUpperCase()} Plan · 2 Tests Remaining
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Welcome back, {userName}! 👋
            </h1>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Your next target is JEE Advanced 2026. Keep up your daily diagnostic momentum and AI doubt hint resolutions.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/doubts" className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2">
              <Sparkles size={14} /> Ask AI Doubt
            </Link>
            <Link href="/test-generator" className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all backdrop-blur flex items-center gap-2">
              <Target size={14} /> Generate Test
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Doubts Resolved', value: String(stats.doubts_solved), icon: Sparkles, color: 'text-purple-600 bg-purple-50' },
            { label: 'Tests Attempted', value: String(stats.tests_attempted), icon: Award, color: 'text-blue-600 bg-blue-50' },
            { label: 'Assignments', value: String(stats.assignments_completed), icon: Clock, color: 'text-emerald-600 bg-emerald-50' },
            { label: 'Accuracy Rate', value: `${stats.accuracy_percent}%`, icon: ArrowUpRight, color: 'text-rose-600 bg-rose-50' },
          ].map(card => (
            <div key={card.label} className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{card.label}</p>
                <p className="text-2xl font-extrabold text-slate-900 mt-1">{card.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`}>
                <card.icon size={20} />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-bold text-slate-900">Recent AI Doubts</h2>
              <Link href="/doubts" className="text-xs font-bold text-blue-600 hover:underline">View All</Link>
            </div>
            <div className="space-y-3">
              {[
                { title: 'Evaluate ∫₀^(π/2) ln(sin x) dx', topic: 'Definite Integration', status: '3 Hints Revealed' },
                { title: 'Find limit of (1 + 1/n)^n as n -> infinity', topic: 'Limits', status: 'Solved' },
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-semibold text-slate-800 font-mono">{item.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{item.topic}</p>
                  </div>
                  <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full">{item.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900">Quick Modules</h2>
            <div className="space-y-3">
              <Link href="/theory" className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-100 bg-slate-50 hover:bg-blue-50 transition-all">
                <BookOpen className="text-blue-600" size={18} />
                <div>
                  <p className="text-xs font-bold text-slate-900">Theory & Notes</p>
                  <p className="text-[10px] text-slate-500">Read concept sheets</p>
                </div>
              </Link>
              <Link href="/formula-sheet" className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-100 bg-slate-50 hover:bg-purple-50 transition-all">
                <FileText className="text-purple-600" size={18} />
                <div>
                  <p className="text-xs font-bold text-slate-900">Formula Sheets</p>
                  <p className="text-[10px] text-slate-500">Quick math formulas</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
