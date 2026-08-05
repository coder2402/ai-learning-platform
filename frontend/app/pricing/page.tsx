'use client'

import Layout from '../../src/components/Layout'
import { Check, Sparkles } from 'lucide-react'

export default function PricingPage() {
  return (
    <Layout>
      <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h1 className="text-3xl font-extrabold text-slate-900">Simple, Transparent Pricing</h1>
          <p className="text-xs text-slate-500">Master mathematics step-by-step without token limits or complex pricing</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-6 shadow-sm">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                Free Forever
              </span>
              <h2 className="text-2xl font-bold text-slate-900 mt-4">Free Plan</h2>
              <p className="text-3xl font-extrabold text-slate-900 mt-2">$0 <span className="text-xs text-slate-400 font-normal">/ month</span></p>
            </div>
            <ul className="space-y-3 text-xs text-slate-600">
              {['Socratic AI Doubt Solver hints', '2 Full Mock Tests every 15 days', 'Up to 40 questions every 15 days', 'Complete Theory & Formula Sheets'].map(feat => (
                <li key={feat} className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-600" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
            <button className="w-full py-3 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl">Current Plan</button>
          </div>

          <div className="bg-slate-900 text-white rounded-3xl p-8 space-y-6 shadow-xl relative overflow-hidden border border-slate-800">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 bg-purple-500/20 px-3 py-1 rounded-full border border-purple-400/20">
                Pro Advanced
              </span>
              <h2 className="text-2xl font-bold text-white mt-4">Premium Membership</h2>
              <p className="text-3xl font-extrabold text-white mt-2">$12 <span className="text-xs text-slate-400 font-normal">/ month</span></p>
            </div>
            <ul className="space-y-3 text-xs text-slate-300">
              {['Unlimited Mock Tests & Generator', 'Unlimited Question Attempts', 'Priority Gemini 2.0 Flash AI Doubt Resolution', 'Detailed Analytics & Weak Spot Diagnosis'].map(feat => (
                <li key={feat} className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
            <button className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2">
              <Sparkles size={14} /> Upgrade to Premium
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}
