import type { DemoData } from '../types'
import { initialDemoData } from './seed'

const STORAGE_KEY = 'placex-demo-v1'

// Local browser data is only used when the API is unavailable or has no admin token.
export const demoService = {
  async load(): Promise<DemoData> {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? { ...initialDemoData, ...JSON.parse(raw) as Partial<DemoData> } : initialDemoData
    } catch { return initialDemoData }
  },
  async save(data: DemoData): Promise<void> {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  },
  async savePreferences(data: DemoData): Promise<void> {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      const current = raw ? JSON.parse(raw) as Partial<DemoData> : {}
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, academicYear:data.academicYear, adminName:data.adminName, email:data.email, notifications:data.notifications, theme:data.theme }))
    } catch { /* The connected API remains the source of placement records. */ }
  },
  async reset(): Promise<DemoData> {
    localStorage.removeItem(STORAGE_KEY)
    return initialDemoData
  },
}

export const apiEndpoints = {
  students: '/api/students', companies: '/api/companies', drives: '/api/drives',
  eligibility: '/api/eligibility/check', applications: '/api/applications', selections: '/api/selections',
} as const
