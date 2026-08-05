'use client'

import Link from 'next/link'
import {
  Sparkles, BookOpen, FlaskConical, FileText, Brain,
  CheckCircle, Star, ArrowRight, ChevronDown, Play,
  Target, ChevronRight
} from 'lucide-react'
import { useState } from 'react'

const features = [
  {
    icon: Brain,
    color: 'blue',
    title: 'AI Doubt Solver',
    desc: 'Upload any math question — get step-by-step solutions with hints, not just answers. Learns your weak areas.',
  },
  {
    icon: FlaskConical,
    color: 'purple',
    title: 'Smart Test Generator',
    desc: 'Generate custom tests by topic, difficulty, and question type. JEE, NEET, CUET — all exam patterns.',
  },
  {
    icon: FileText,
    color: 'green',
    title: 'Topic-wise Assignments',
    desc: 'Curated problem sets for every concept. Track your progress and identify gaps automatically.',
  },
  {
    icon: FileText,
    color: 'orange',
    title: 'Formula Sheets',
    desc: 'All formulas, identities, and theorems in one place. Print-ready and beautifully organized.',
  },
  {
    icon: BookOpen,
    color: 'blue',
    title: 'Structured Theory',
    desc: 'In-depth theory with examples, visual diagrams, and connections to real exam questions.',
  },
  {
    icon: Target,
    color: 'purple',
    title: 'PYQ Practice',
    desc: 'Previous year questions from JEE, NEET, and more — with full solutions and analysis.',
  },
]

const testimonials = [
  {
    name: 'Priya Mehta',
    exam: 'JEE Advanced 2024 — AIR 847',
    text: 'The AI Doubt Solver is unlike anything else. It doesn\'t just give answers — it teaches me how to think through problems. My calculus score jumped from 40% to 85%.',
    avatar: 'PM',
    color: 'from-blue-500 to-purple-600',
  },
  {
    name: 'Rohan Verma',
    exam: 'NEET 2024 — AIR 312',
    text: 'Formula sheets are beautifully organized. I used to spend hours making notes — now I just use MathAI and focus on practice. Worth every rupee.',
    avatar: 'RV',
    color: 'from-purple-500 to-pink-600',
  },
  {
    name: 'Sneha Agarwal',
    exam: 'JEE Mains 2024 — 99.2 percentile',
    text: 'The test generator is insane. I could create topic-specific tests at exact difficulty levels. It\'s like having a personal coaching institute in my pocket.',
    avatar: 'SA',
    color: 'from-green-500 to-teal-600',
  },
]

const faqs = [
  {
    q: 'How is MathAI different from other platforms?',
    a: 'MathAI is built AI-first using Google Gemini 2.0 Flash. Instead of just providing static answers, the Socratic AI breaks problems down into progressive hints before revealing final solutions.',
  },
  {
    q: 'Which exams does MathAI support?',
    a: 'JEE Mains, JEE Advanced, NEET, CUET, BITSAT, and all major state engineering entrance exams. Our question bank covers Class 11 and 12 Mathematics.',
  },
  {
    q: 'Can I use MathAI on my phone?',
    a: 'Yes. MathAI is fully responsive and works beautifully on all mobile browsers and tablets.',
  },
  {
    q: 'Is the free plan actually useful?',
    a: 'The free plan gives you Socratic AI doubt resolution, 2 mock tests every 15 days, 40 questions per 15 days, and complete access to theory and formula sheets.',
  },
]

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">Σ</span>
            </div>
            <span className="font-bold text-gray-900 text-lg">MathAI</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <a href="#features" className="hover:text-gray-900">Features</a>
            <a href="#testimonials" className="hover:text-gray-900">Testimonials</a>
            <Link href="/pricing" className="hover:text-gray-900">Pricing</Link>
            <a href="#faq" className="hover:text-gray-900">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 font-medium">Log in</Link>
            <Link href="/register" className="text-sm bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-700">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white" />

        <div className="max-w-7xl mx-auto relative">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-blue-700 text-sm font-medium mb-6">
                <Sparkles size={14} />
                AI-Powered Mathematics Learning
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-[1.1] tracking-tight mb-6">
                Learn Mathematics with AI that{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  teaches,
                </span>{' '}
                not just answers.
              </h1>
              <p className="text-lg sm:text-xl text-gray-500 mb-8 max-w-2xl">
                From JEE to NEET — AI-guided doubts, smart tests, curated assignments, formula sheets, and structured theory. Everything you need, nothing you don&apos;t.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-10">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/25"
                >
                  Start Learning
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                >
                  <Play size={16} className="text-blue-600" />
                  View Demo
                </Link>
              </div>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start text-sm text-gray-500">
                {['AI Guided Doubts', 'Smart Tests', 'Formula Sheets', 'PYQ Practice'].map(tag => (
                  <div key={tag} className="flex items-center gap-1.5">
                    <CheckCircle size={14} className="text-green-500" />
                    <span>{tag}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 w-full max-w-lg">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-3xl" />
                <div className="relative bg-white rounded-2xl border border-gray-100 shadow-2xl shadow-gray-200/50 overflow-hidden">
                  <div className="bg-gray-50 border-b border-gray-100 px-4 py-3 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                    <span className="ml-2 text-xs text-gray-400 font-mono">Socratic AI Solver</span>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 text-xs font-bold text-gray-600">A</div>
                      <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm text-gray-700 max-w-xs">
                        Evaluate <span className="font-mono text-blue-600 text-xs bg-blue-50 px-1.5 py-0.5 rounded">∫₀^(π/2) ln(sin x) dx</span>
                      </div>
                    </div>
                    <div className="flex gap-3 justify-end">
                      <div className="bg-blue-600 rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm text-white max-w-xs">
                        <p className="font-semibold mb-1 flex items-center gap-1"><Sparkles size={12} /> Hint 1: Symmetry</p>
                        <p className="text-xs font-mono">Apply King&apos;s Property I = ∫₀ᵃ f(a−x)dx</p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 text-white font-bold text-xs">
                        AI
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center mb-14">
          <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Everything You Need</span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-gray-900">
            An AI that truly understands mathematics
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10 text-left">
            {features.map(({ icon: Icon, color, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-blue-100 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <Icon size={22} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
