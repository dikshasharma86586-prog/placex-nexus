import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { Company, DemoData, EligibilityResult, PlacementDrive, Selection, Student } from './types'
import { ApiError, apiService, hasAdminToken } from './services/api'
import { demoService } from './services/demoService'
import { initialDemoData } from './services/seed'
import { evaluateEligibility } from './utils'

export type ApiConnection = 'connecting' | 'connected' | 'fallback' | 'error'
type Store = DemoData & {
  ready: boolean
  connection: ApiConnection
  connectionMessage: string
  connect: () => Promise<void>
  checkEligibility: (studentId: string, driveId: string) => Promise<EligibilityResult>
  eligibleStudents: (driveId: string) => Promise<Student[]>
  updateStudent: (student: Student) => Promise<void>
  removeStudent: (id: string) => Promise<void>
  updateCompany: (company: Company) => Promise<void>
  removeCompany: (id: string) => Promise<void>
  updateDrive: (drive: PlacementDrive) => Promise<void>
  removeDrive: (id: string) => Promise<void>
  addSelection: (studentId: string, driveId: string) => Promise<void>
  updateSelection: (selection: Selection) => Promise<void>
  updateAssessment: (id: string, score: number) => Promise<void>
  removeSelection: (id: string) => Promise<void>
  updateSettings: (settings: Partial<Pick<DemoData,'academicYear'|'adminName'|'email'|'notifications'|'theme'>>) => void
  reset: () => Promise<void>
}

const StoreContext = createContext<Store | null>(null)
const selectedStatuses = ['Selected', 'Offered', 'Offer Accepted']

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<DemoData>(initialDemoData)
  const dataRef = useRef(data)
  const [ready, setReady] = useState(false)
  const [connection, setConnection] = useState<ApiConnection>('connecting')
  const connectionRef = useRef<ApiConnection>('connecting')
  const [connectionMessage, setConnectionMessage] = useState('Loading placement records…')

  const setMode = useCallback((mode: ApiConnection, message: string) => {
    connectionRef.current = mode
    setConnection(mode)
    setConnectionMessage(message)
  }, [])

  const replaceRemoteData = useCallback((remote: Pick<DemoData, 'students' | 'companies' | 'drives' | 'selections'>) => {
    setData(current => {
      const next = { ...current, ...remote }
      dataRef.current = next
      return next
    })
  }, [])

  const connect = useCallback(async () => {
    const previousMode = connectionRef.current
    setMode('connecting', 'Connecting to the PlaceX backend…')
    try {
      const remote = await apiService.load()
      replaceRemoteData(remote)
      setMode('connected', 'Connected to the PlaceX API. Record changes are saved to MySQL.')
    } catch (error) {
      const detail = error instanceof Error ? error.message : 'Unknown connection error.'
      const mode = previousMode === 'connected' || previousMode === 'error' ? 'error' : 'fallback'
      const message = mode === 'error'
        ? `The backend could not be reached. Changes are blocked until you reconnect. ${detail}`
        : `The backend is unavailable. Browser data is a development fallback and saves only in this browser. ${detail}`
      setMode(mode, message)
      throw error instanceof Error ? error : new Error(detail)
    }
  }, [replaceRemoteData, setMode])

  useEffect(() => {
    let active = true
    void demoService.load().then(stored => {
      if (!active) return
      dataRef.current = stored
      setData(stored)
      setReady(true)
      if (hasAdminToken()) {
        void connect().catch(() => undefined)
      } else {
        setMode('fallback', 'Connect the administrator token in Settings to use MySQL. Browser data is a development fallback.')
      }
    })
    return () => { active = false }
  }, [connect, setMode])

  useEffect(() => {
    if (!ready) return
    if (connection === 'fallback') void demoService.save(data)
    if (connection === 'connected') void demoService.savePreferences(data)
  }, [data, ready, connection])

  const mutate = useCallback(async (remoteAction: () => Promise<unknown>, fallbackAction: (current: DemoData) => DemoData) => {
    const mode = connectionRef.current
    if (mode === 'fallback') {
      setData(current => {
        const next = fallbackAction(current)
        dataRef.current = next
        return next
      })
      return
    }
    if (mode !== 'connected') throw new Error('The backend is not connected. Reconnect before changing placement records.')

    try {
      await remoteAction()
    } catch (error) {
      const detail = error instanceof Error ? error.message : 'Unknown API error.'
      if (!(error instanceof ApiError) || error.status === 0 || error.status === 401 || error.status >= 500) {
        setMode('error', `No local save was made. The API request failed; reconnect and refresh before retrying. ${detail}`)
      } else {
        setConnectionMessage(`The API rejected this change. No record was changed. ${detail}`)
      }
      throw error instanceof Error ? error : new Error(detail)
    }
    try {
      const remote = await apiService.load()
      replaceRemoteData(remote)
    } catch (error) {
      const detail = error instanceof Error ? error.message : 'Unknown refresh error.'
      setMode('error', `The API accepted the change but the data refresh failed. Reconnect before making another change. ${detail}`)
      throw new Error(`The backend accepted the change, but the page could not refresh its data. ${detail}`)
    }
  }, [replaceRemoteData, setMode])

  const updateStudent = useCallback((student: Student) => mutate(
    () => apiService.saveStudent(student, !dataRef.current.students.some(item => item.id === student.id)),
    current => {
      const isPlaced = current.selections.some(selection => selection.studentId === student.id && selectedStatuses.includes(selection.status))
      const normalized = { ...student, placementStatus: isPlaced ? 'Placed' as const : 'Not placed' as const }
      return { ...current, students: current.students.some(item => item.id === student.id)
        ? current.students.map(item => item.id === student.id ? normalized : item) : [normalized, ...current.students] }
    },
  ), [mutate])

  const removeStudent = useCallback((id: string) => mutate(
    () => apiService.deleteStudent(id),
    current => ({ ...current, students: current.students.filter(student => student.id !== id), selections: current.selections.filter(selection => selection.studentId !== id) }),
  ), [mutate])

  const updateCompany = useCallback((company: Company) => mutate(
    () => apiService.saveCompany(company, !dataRef.current.companies.some(item => item.id === company.id)),
    current => ({ ...current, companies: current.companies.some(item => item.id === company.id)
      ? current.companies.map(item => item.id === company.id ? company : item) : [company, ...current.companies] }),
  ), [mutate])

  const removeCompany = useCallback((id: string) => mutate(
    () => apiService.deleteCompany(id),
    current => {
      const drives = current.drives.filter(drive => drive.companyId !== id)
      const selections = current.selections.filter(selection => selection.companyId !== id)
      const placedIds = new Set(selections.filter(selection => selectedStatuses.includes(selection.status)).map(selection => selection.studentId))
      return { ...current, companies: current.companies.filter(company => company.id !== id), drives, selections,
        students: current.students.map(student => ({ ...student, placementStatus: placedIds.has(student.id) ? 'Placed' : 'Not placed' })) }
    },
  ), [mutate])

  const updateDrive = useCallback((drive: PlacementDrive) => mutate(
    () => apiService.saveDrive(drive, !dataRef.current.drives.some(item => item.id === drive.id)),
    current => ({ ...current, drives: current.drives.some(item => item.id === drive.id)
      ? current.drives.map(item => item.id === drive.id ? drive : item) : [drive, ...current.drives] }),
  ), [mutate])

  const removeDrive = useCallback((id: string) => mutate(
    () => apiService.deleteDrive(id),
    current => {
      const drives = current.drives.filter(drive => drive.id !== id)
      const selections = current.selections.filter(selection => selection.driveId !== id)
      const placedIds = new Set(selections.filter(selection => selectedStatuses.includes(selection.status)).map(selection => selection.studentId))
      return { ...current, drives, selections, students: current.students.map(student => ({ ...student, placementStatus: placedIds.has(student.id) ? 'Placed' : 'Not placed' })) }
    },
  ), [mutate])

  const addSelection = useCallback((studentId: string, driveId: string) => {
    if (connectionRef.current === 'fallback' && dataRef.current.selections.some(selection => selection.studentId === studentId && selection.driveId === driveId)) {
      return Promise.reject(new Error('This student already has an application for this drive.'))
    }
    return mutate(
      () => apiService.createApplication(driveId, studentId),
      current => ({ ...current, selections: [{ id: `sel-${Date.now()}`, studentId, driveId,
        companyId: current.drives.find(drive => drive.id === driveId)?.companyId ?? '', status: 'Applied',
        updatedAt: new Date().toISOString().slice(0, 10) }, ...current.selections] }),
    )
  }, [mutate])

  const updateSelection = useCallback((selection: Selection) => mutate(
    () => apiService.updateApplicationStatus(selection.id, selection.status),
    current => {
      const selections = current.selections.some(item => item.id === selection.id)
        ? current.selections.map(item => item.id === selection.id ? selection : item) : [selection, ...current.selections]
      const placedIds = new Set(selections.filter(item => selectedStatuses.includes(item.status)).map(item => item.studentId))
      return { ...current, selections, students: current.students.map(student => ({ ...student, placementStatus: placedIds.has(student.id) ? 'Placed' : 'Not placed' })) }
    },
  ), [mutate])

  const updateAssessment = useCallback((id: string, score: number) => mutate(
    () => apiService.saveAssessmentScore(id, score),
    current => ({ ...current, selections: current.selections.map(selection => selection.id === id
      ? { ...selection, assessmentScore: score, updatedAt: new Date().toISOString().slice(0, 10) } : selection) }),
  ), [mutate])

  const removeSelection = useCallback((id: string) => mutate(
    () => apiService.deleteApplication(id),
    current => {
      const selections = current.selections.filter(selection => selection.id !== id)
      const placedIds = new Set(selections.filter(selection => selectedStatuses.includes(selection.status)).map(selection => selection.studentId))
      return { ...current, selections, students: current.students.map(student => ({ ...student, placementStatus: placedIds.has(student.id) ? 'Placed' : 'Not placed' })) }
    },
  ), [mutate])

  const checkEligibility = useCallback(async (studentId: string, driveId: string) => {
    if (connectionRef.current === 'connected') {
      try { return await apiService.checkEligibility(studentId, driveId) }
      catch (error) {
        const detail = error instanceof Error ? error.message : 'Unknown API error.'
        setMode('error', `The backend eligibility check failed. Reconnect before relying on this result. ${detail}`)
        throw error instanceof Error ? error : new Error(detail)
      }
    }
    if (connectionRef.current !== 'fallback') throw new Error('The backend is not connected. Connect it before checking eligibility.')
    const student = dataRef.current.students.find(item => item.id === studentId)
    const drive = dataRef.current.drives.find(item => item.id === driveId)
    if (!student || !drive) throw new Error('Choose a student and a placement drive to check eligibility.')
    return evaluateEligibility(student, drive)
  }, [setMode])

  const eligibleStudents = useCallback(async (driveId: string) => {
    if (connectionRef.current === 'connected') {
      try { return await apiService.eligibleStudents(driveId) }
      catch (error) {
        const detail = error instanceof Error ? error.message : 'Unknown API error.'
        setMode('error', `The backend batch eligibility request failed. Reconnect before relying on this list. ${detail}`)
        throw error instanceof Error ? error : new Error(detail)
      }
    }
    if (connectionRef.current !== 'fallback') throw new Error('The backend is not connected. Connect it before loading eligible students.')
    const drive = dataRef.current.drives.find(item => item.id === driveId)
    return drive ? dataRef.current.students.filter(student => evaluateEligibility(student, drive).eligible) : []
  }, [setMode])

  const updateSettings = useCallback((settings: Partial<Pick<DemoData,'academicYear'|'adminName'|'email'|'notifications'|'theme'>>) => {
    setData(current => {
      const next = { ...current, ...settings }
      dataRef.current = next
      return next
    })
  }, [])

  const reset = useCallback(async () => {
    if (connectionRef.current !== 'fallback') throw new Error('Reset is available only for browser demo data. Backend records were not changed.')
    const fresh = await demoService.reset()
    dataRef.current = fresh
    setData(fresh)
  }, [])

  const value = useMemo<Store>(() => ({ ...data, ready, connection, connectionMessage, connect,
    checkEligibility, eligibleStudents, updateStudent, removeStudent, updateCompany, removeCompany,
    updateDrive, removeDrive, addSelection, updateSelection, updateAssessment, removeSelection, updateSettings, reset }),
  [data, ready, connection, connectionMessage, connect, checkEligibility, eligibleStudents, updateStudent,
    removeStudent, updateCompany, removeCompany, updateDrive, removeDrive, addSelection, updateSelection, updateAssessment,
    removeSelection, updateSettings, reset])
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const value = useContext(StoreContext)
  if (!value) throw new Error('useStore must be used within StoreProvider')
  return value
}
