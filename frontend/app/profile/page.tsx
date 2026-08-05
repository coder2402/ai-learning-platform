'use client'

import Layout from '../../src/components/Layout'
import { useState, useEffect } from 'react'
import { Award, Clock, Sparkles, BookOpen, CheckCircle, Shield } from 'lucide-react'
import { api } from '../../src/services/api'

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'tests' | 'doubts' | 'assignments' | 'subscription'>('tests')

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await api.getUserProfile()
        setProfileData(data)
      } catch (err) {
        setProfileData(null)
      }
    }
    loadProfile()
  }, [])

  const name = profileData?.name || 'Alex Sharma'
  const email = profileData?.email || 'student@math.com'
  const plan = profileData?.plan || 'free'
  const limits = profileData?.subscription_limits || { tests_used: 1, max_tests: 2, questions_used: 10, max_questions: 40, window_days: 15 }
  const doubtHistory = profileData?.doubt_history || [
    { id: 1, question: 'Evaluate ∫₀^(π/2) ln(sin x) dx', date: 'Today' },
    { id: 2, question: 'Find principal argument of z = (1 + i)⁸', date: 'Yesterday' }
  ]
  const testHistory = profileData?.test_history || [
    { id: 1, topic: 'Calculus', score: 32, total: 40, status: 'completed', date: 'Today' }
  ]
  const assignmentHistory = profileData?.assignment_history || [
    { id: 1, title: 'Definite Integration Advanced Problem Set', topic: 'Calculus', status: 'Completed' }
  ]

  return (
    <Layout>
      <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-2xl font-extrabold text-slate-900">Student Profile & Learning History</h1>
          <p className="text-xs text-slate-500 mt-0.5">Track your diagnostic test attempts, AI doubt resolution history, and plan limits</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white text-xl font-bold flex items-center justify-center shadow-md shadow-blue-500/20">
                {name.split(' ').map((n: string) => n[0]).join('')}
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">{name}</h2>
                <p className="text-xs text-slate-500">{email} · Target: JEE Advanced 2026</p>
                <span className="inline-block mt-2 text-[10px] font-bold bg-purple-100 text-purple-700 px-3 py-1 rounded-full border border-purple-200">
                  {plan.toUpperCase()} Subscription Tier
                </span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs space-y-1 w-full sm:w-auto">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Plan Limit Reset Window</p>
              <p className="font-bold text-slate-800">{limits.tests_used} / {limits.max_tests} Tests · {limits.questions_used} / {limits.max_questions} Questions</p>
              <p className="text-[10px] text-slate-500 font-medium">Rolling 15-day window enforcement</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 border-b border-slate-100 pb-2 overflow-x-auto">
            {[
              { id: 'tests', label: `Test History (${testHistory.length})`, icon: Award },
              { id: 'doubts', label: `Doubt History (${doubtHistory.length})`, icon: Sparkles },
              { id: 'assignments', label: `Assignments (${assignmentHistory.length})`, icon: BookOpen },
              { id: 'subscription', label: 'Subscription Details', icon: Shield },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'tests' && (
            <div className="space-y-3">
              {testHistory.map((t: any) => (
                <div key={t.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{t.topic} Test Paper</p>
                    <p className="text-xs text-slate-500 mt-0.5">Attempted: {t.date} · Status: {t.status}</p>
                  </div>
                  <span className="text-sm font-extrabold text-blue-600 bg-blue-50 px-3 py-1 rounded-xl border border-blue-100">
                    {t.score} / {t.total} Marks
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'doubts' && (
            <div className="space-y-3">
              {doubtHistory.map((d: any) => (
                <div key={d.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold font-mono text-slate-800">{d.question}</p>
                    <p className="text-xs text-slate-500 mt-0.5">Resolved on: {d.date}</p>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full">
                    Socratic Hints Saved
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'assignments' && (
            <div className="space-y-3">
              {assignmentHistory.map((a: any) => (
                <div key={a.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{a.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">Topic: {a.topic}</p>
                  </div>
                  <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle size={10} /> {a.status}
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'subscription' && (
            <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-extrabold text-base">Free Plan Subscription</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Strict limit enforcement: Max 2 tests or 40 questions every 15 days</p>
                </div>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 font-bold text-xs rounded-full border border-emerald-400/20">Active</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
