import type { Company, EligibilityResult, PlacementDrive, Student } from './types'

export const branches = ['Computer Science','Information Technology','Electronics','Mechanical','Civil Engineering']
export const recruitmentStatuses = ['Applied','Assessment Cleared','Interview Shortlisted','Selected','Rejected','Offered','Offer Accepted'] as const
export const driveStages = ['Upcoming','Registration Open','Assessment','Interview','Results Declared'] as const
export const money = (value: number) => `₹${value.toLocaleString('en-IN')} LPA`
export const initials = (name: string) => name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()

export function evaluateEligibility(student: Student, drive: PlacementDrive): EligibilityResult {
  const checks = [
    { label:'Minimum CGPA', passed:student.cgpa >= drive.minCgpa, actual:`${student.cgpa.toFixed(1)} CGPA`, required:`${drive.minCgpa.toFixed(1)} CGPA or above` },
    { label:'Eligible branch', passed:drive.branches.includes(student.branch), actual:student.branch, required:drive.branches.join(', ') },
    { label:'Graduation year', passed:drive.graduationYear == null || student.graduationYear === drive.graduationYear, actual:String(student.graduationYear), required:drive.graduationYear == null ? 'Any graduation year' : String(drive.graduationYear) },
    { label:'Active backlogs', passed:student.backlogs <= drive.maxBacklogs, actual:String(student.backlogs), required:`${drive.maxBacklogs} or fewer` },
  ]
  return { eligible:checks.every(c => c.passed), checks }
}

export function csvDownload(filename: string, rows: (string | number)[][]) {
  const csv = rows.map(row => row.map(value => `"${String(value).replaceAll('"','""')}"`).join(',')).join('\r\n')
  const blob = new Blob([`\uFEFF${csv}`], { type:'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob); link.download = filename; link.click(); URL.revokeObjectURL(link.href)
}

export function companyFor(companies: Company[], drive: PlacementDrive) {
  return companies.find(company => company.id === drive.companyId)
}
