const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}))
      throw new Error(errData.detail || `API request failed with status ${res.status}`)
    }

    return await res.json()
  } catch (err: any) {
    console.warn(`[API] Fallback for ${endpoint}:`, err.message)
    throw err
  }
}

export const api = {
  // Auth
  login: (data: any) => fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  register: (data: any) => fetchAPI('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  forgotPassword: (email: string) => fetchAPI('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),

  // AI Doubt Solver
  solveDoubt: (data: { question: string; math_expr?: string }) =>
    fetchAPI('/doubts/solve', { method: 'POST', body: JSON.stringify(data) }),

  // Tests
  generateTest: (data: any) => fetchAPI('/tests/generate', { method: 'POST', body: JSON.stringify(data) }),
  submitTest: (testId: number, answers: any) =>
    fetchAPI(`/tests/${testId}/submit`, { method: 'POST', body: JSON.stringify({ answers }) }),

  // Solution Review
  getSolution: (questionId: number) => fetchAPI(`/solutions/${questionId}`),

  // Content & Dashboard
  getTopics: () => fetchAPI('/topics/'),
  getTheory: (topic: string) => fetchAPI(`/theory/${topic}`),
  getFormulas: (topic: string) => fetchAPI(`/formulas/${topic}`),
  getAssignments: () => fetchAPI('/assignments/'),
  getPYQ: (topic?: string, diff?: string) =>
    fetchAPI(`/pyq/?${topic ? `topic=${topic}&` : ''}${diff ? `difficulty=${diff}` : ''}`),
  getDashboard: () => fetchAPI('/users/dashboard'),
  getUserProfile: () => fetchAPI('/users/profile'),
}
