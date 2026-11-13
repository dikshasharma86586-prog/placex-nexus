import type { Company, DemoData, EligibilityResult, PlacementDrive, Selection, Student } from '../types'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api').replace(/\/$/, '')
const ADMIN_TOKEN_KEY = 'placex-admin-token'
const companyColors = ['#6857E8', '#7E8097', '#8D87D7', '#AAA5C6', '#9494AC']

export class ApiError extends Error {
  status: number
  constructor(message: string, status = 0) { super(message); this.name = 'ApiError'; this.status = status }
}

function adminToken() {
  return typeof sessionStorage === 'undefined' ? '' : sessionStorage.getItem(ADMIN_TOKEN_KEY) || ''
}

export function hasAdminToken() { return Boolean(adminToken()) }
export function setAdminToken(value: string) {
  if (typeof sessionStorage === 'undefined') return
  if (value.trim()) sessionStorage.setItem(ADMIN_TOKEN_KEY, value.trim())
  else sessionStorage.removeItem(ADMIN_TOKEN_KEY)
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers)
  headers.set('Accept', 'application/json')
  if (options.body) headers.set('Content-Type', 'application/json')
  const token = adminToken()
  if (token) headers.set('X-Admin-Token', token)

  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers })
  } catch {
    throw new ApiError(`Cannot reach ${API_BASE_URL}. Start the Java backend and check VITE_API_BASE_URL.`)
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null) as { message?: string } | null
    const message = body?.message || (response.status === 401
      ? 'The backend needs a valid administrator token. Set it in Settings and connect again.'
      : `The backend returned ${response.status} ${response.statusText}.`)
    throw new ApiError(message, response.status)
  }
  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

function companyForUi(company: Omit<Company, 'initials' | 'color'> & Partial<Pick<Company, 'initials' | 'color'>>): Company {
  return {
    ...company,
    initials: company.initials || company.name.split(/\s+/).map(part => part[0]).slice(0, 2).join('').toUpperCase(),
    color: company.color || companyColors[Math.abs(hash(company.id)) % companyColors.length],
  }
}

function hash(value: string) {
  let result = 0
  for (const character of value) result = (result * 31 + character.charCodeAt(0)) | 0
  return result
}

export const apiService = {
  async load(): Promise<Pick<DemoData, 'students' | 'companies' | 'drives' | 'selections'>> {
    const [students, companies, drives, selections] = await Promise.all([
      request<Student[]>('/students'), request<Company[]>('/companies'),
      request<PlacementDrive[]>('/drives'), request<Selection[]>('/selections'),
    ])
    return { students, companies: companies.map(companyForUi), drives, selections }
  },
  checkEligibility(studentId: string, driveId: string) {
    return request<EligibilityResult>('/eligibility/check', { method: 'POST', body: JSON.stringify({ studentId, driveId }) })
  },
  eligibleStudents(driveId: string) { return request<Student[]>(`/drives/${encodeURIComponent(driveId)}/eligible-students`) },
  saveStudent(student: Student, create: boolean) {
    return request<Student>(create ? '/students' : `/students/${encodeURIComponent(student.id)}`, {
      method: create ? 'POST' : 'PUT', body: JSON.stringify(student),
    })
  },
  deleteStudent(id: string) { return request<void>(`/students/${encodeURIComponent(id)}`, { method: 'DELETE' }) },
  saveCompany(company: Company, create: boolean) {
    return request<Company>(create ? '/companies' : `/companies/${encodeURIComponent(company.id)}`, {
      method: create ? 'POST' : 'PUT', body: JSON.stringify(company),
    })
  },
  deleteCompany(id: string) { return request<void>(`/companies/${encodeURIComponent(id)}`, { method: 'DELETE' }) },
  saveDrive(drive: PlacementDrive, create: boolean) {
    return request<PlacementDrive>(create ? '/drives' : `/drives/${encodeURIComponent(drive.id)}`, {
      method: create ? 'POST' : 'PUT', body: JSON.stringify(drive),
    })
  },
  deleteDrive(id: string) { return request<void>(`/drives/${encodeURIComponent(id)}`, { method: 'DELETE' }) },
  createApplication(driveId: string, studentId: string) {
    return request<Selection>(`/drives/${encodeURIComponent(driveId)}/applications`, {
      method: 'POST', body: JSON.stringify({ studentId }),
    })
  },
  updateApplicationStatus(id: string, status: Selection['status']) {
    return request<Selection>(`/applications/${encodeURIComponent(id)}/status`, {
      method: 'PATCH', body: JSON.stringify({ status }),
    })
  },
  saveAssessmentScore(id: string, score: number) {
    return request<Selection>(`/applications/${encodeURIComponent(id)}/assessment`, {
      method: 'PATCH', body: JSON.stringify({ score }),
    })
  },
  deleteApplication(id: string) { return request<void>(`/applications/${encodeURIComponent(id)}`, { method: 'DELETE' }) },
}
