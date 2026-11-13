export type PlacementStatus = 'Not placed' | 'Placed'
export type RecruitmentStatus = 'Applied' | 'Assessment Cleared' | 'Interview Shortlisted' | 'Selected' | 'Rejected' | 'Offered' | 'Offer Accepted'
export type DriveStage = 'Upcoming' | 'Registration Open' | 'Assessment' | 'Interview' | 'Results Declared'

export interface Student {
  id: string; name: string; rollNo: string; email: string; phone: string; branch: string
  cgpa: number; graduationYear: number; skills: string[]; backlogs: number; placementStatus: PlacementStatus
}
export interface Company {
  id: string; name: string; industry: string; role: string; minCgpa: number; branches: string[]
  packageLpa: number; positions: number; maxBacklogs: number; status: 'Active' | 'Completed' | 'On hold'; initials: string; color: string
}
export interface PlacementDrive {
  id: string; companyId: string; jobTitle: string; description: string; date: string; deadline: string
  minCgpa: number; branches: string[]; packageLpa: number; openings: number; stage: DriveStage; graduationYear: number | null; maxBacklogs: number
}
export interface Selection {
  id: string; studentId: string; companyId: string; driveId: string; status: RecruitmentStatus; updatedAt: string; assessmentScore?: number | null
}
export interface DemoData {
  students: Student[]; companies: Company[]; drives: PlacementDrive[]; selections: Selection[]
  academicYear: string; adminName: string; email: string; notifications: boolean; theme: 'Light' | 'Dark' | 'System'
}
export interface EligibilityResult {
  eligible: boolean
  checks: { label: string; passed: boolean; actual: string; required: string; explanation?: string }[]
  criteriaPassed?: { label: string; passed: boolean; actual: string; required: string; explanation?: string }[]
  criteriaFailed?: { label: string; passed: boolean; actual: string; required: string; explanation?: string }[]
  explanations?: string[]
}
