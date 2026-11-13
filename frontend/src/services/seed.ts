import type { Company, DemoData, PlacementDrive, Selection, Student } from '../types'
import { branches } from '../utils'

const students: Student[] = [
  ['Aarav Mehta','CS21-001','Computer Science',9.2,0,['React','Python','SQL'],'Placed'],
  ['Ananya Iyer','CS21-002','Computer Science',8.8,0,['Java','Spring','AWS'],'Placed'],
  ['Ishaan Kapoor','IT21-014','Information Technology',8.1,0,['TypeScript','Node.js','Figma'],'Placed'],
  ['Diya Sharma','EC21-021','Electronics',7.6,0,['Embedded C','Python','IoT'],'Placed'],
  ['Arjun Nair','CS21-018','Computer Science',7.4,0,['Java','DSA','React'],'Placed'],
  ['Myra Desai','ME21-009','Mechanical',8.3,0,['AutoCAD','SolidWorks','Python'],'Placed'],
  ['Kabir Rao','IT21-032','Information Technology',7.2,0,['SQL','Java','Git'],'Placed'],
  ['Saanvi Reddy','CS21-027','Computer Science',8.6,0,['Go','Docker','Kubernetes'],'Placed'],
  ['Reyansh Gupta','EC21-008','Electronics',6.9,1,['C++','MATLAB','Verilog'],'Not placed'],
  ['Aadhya Menon','CS21-030','Computer Science',9.5,0,['Python','ML','TensorFlow'],'Not placed'],
  ['Vivaan Shah','CE21-011','Civil Engineering',7.8,0,['Revit','AutoCAD','Excel'],'Not placed'],
  ['Kiara Joshi','IT21-041','Information Technology',6.4,0,['HTML','CSS','JavaScript'],'Not placed'],
  ['Advik Singh','EC21-016','Electronics',8.0,0,['VLSI','Verilog','C'],'Not placed'],
  ['Sara Fernandes','CS21-045','Computer Science',7.1,0,['Java','SQL','Selenium'],'Not placed'],
  ['Rudra Kulkarni','ME21-023','Mechanical',6.8,2,['Creo','ANSYS','C'],'Not placed'],
  ['Nisha Verma','CS21-051','Computer Science',8.2,0,['Python','Django','PostgreSQL'],'Not placed'],
  ['Atharv Patil','CE21-019','Civil Engineering',7.0,0,['STAAD','Revit','Surveying'],'Not placed'],
  ['Ira Banerjee','IT21-056','Information Technology',8.9,0,['React','Node.js','MongoDB'],'Not placed'],
].map(([name, rollNo, branch, cgpa, backlogs, skills, placementStatus], i) => ({
  id: `stu-${String(i + 1).padStart(3, '0')}`, name: name as string, rollNo: rollNo as string,
  email: `${String(name).toLowerCase().replace(' ', '.')}@campus.edu`, phone: `+91 98${String(32104567 + i * 1753).slice(0, 8)}`,
  branch: branch as string, cgpa: cgpa as number, graduationYear: 2026, skills: skills as string[],
  backlogs: backlogs as number, placementStatus: placementStatus as Student['placementStatus'],
}))

const nameParts = ['Aanya','Rohan','Meera','Kunal','Tara','Neel','Pia','Dev','Rhea','Om','Avni','Yash','Mira','Neil','Aisha','Samar','Leela','Vihaan','Naina','Aarush']
const familyParts = ['Shah','Nair','Kapoor','Rao','Mehta','Iyer','Patel','Menon','Desai','Kulkarni','Bose','Khanna','Reddy','Joshi','Sethi','Pillai','Gupta','Sen','Malhotra','Bhat']
const extraStudents: Student[] = Array.from({ length:1230 }, (_, offset) => {
  const i = offset + 18
  const eligibleForOpenDrive = offset < 852
  const branch = eligibleForOpenDrive ? branches[i % 3] : branches[(offset % 5)]
  const name = `${nameParts[i % nameParts.length]} ${familyParts[Math.floor(i / 3) % familyParts.length]}`
  const rollNo = `${['CS','IT','EC','ME','CE'][branches.indexOf(branch)]}21-${String(i + 1).padStart(3,'0')}`
  const cgpa = eligibleForOpenDrive ? Number((7.1 + ((i * 7) % 29) / 10).toFixed(1)) : branch === 'Computer Science' || branch === 'Information Technology' || branch === 'Electronics' ? Number((6 + (i % 9) / 10).toFixed(1)) : Number((6.2 + (i % 31) / 10).toFixed(1))
  const placed = offset < 304
  return {
    id:`stu-${String(i + 1).padStart(3,'0')}`, name, rollNo,
    email:`${name.toLowerCase().replaceAll(' ','.')}.${i}@campus.edu`, phone:`+91 97${String(30000000 + i * 1397).slice(0,8)}`,
    branch, cgpa, graduationYear:2026, skills:[['Java','SQL','Communication'][i%3],['Python','React','Excel'][(i+1)%3]],
    backlogs:eligibleForOpenDrive||branch==='Mechanical'||branch==='Civil Engineering'?0:(i%4===0?1:0), placementStatus:placed?'Placed':'Not placed',
  }
})
students.push(...extraStudents)

const companies: Company[] = [
  { id:'co-1', name:'Northstar Labs', industry:'Technology', role:'Software Engineer', minCgpa:7, branches:['Computer Science','Information Technology','Electronics'], packageLpa:18, positions:12, maxBacklogs:0, status:'Active', initials:'NL', color:'#6857E8' },
  { id:'co-2', name:'Meridian Finance', industry:'Financial Services', role:'Graduate Analyst', minCgpa:7.5, branches:['Computer Science','Information Technology','Electronics'], packageLpa:14, positions:8, maxBacklogs:0, status:'Active', initials:'MF', color:'#7E8097' },
  { id:'co-3', name:'Vertex Systems', industry:'Enterprise Software', role:'Associate Developer', minCgpa:6.5, branches:['Computer Science','Information Technology','Electronics','Mechanical'], packageLpa:10.5, positions:18, maxBacklogs:1, status:'Active', initials:'VS', color:'#A8A8B8' },
  { id:'co-4', name:'Aster Mobility', industry:'Automotive', role:'Product Engineering Trainee', minCgpa:7, branches:['Mechanical','Electronics','Computer Science'], packageLpa:9, positions:10, maxBacklogs:0, status:'Active', initials:'AM', color:'#74758C' },
  { id:'co-5', name:'Cloudline', industry:'Cloud & Infrastructure', role:'Cloud Support Associate', minCgpa:6, branches:['Computer Science','Information Technology'], packageLpa:7.5, positions:15, maxBacklogs:0, status:'Completed', initials:'CL', color:'#706A85' },
  { id:'co-6', name:'Oak & Stone', industry:'Engineering & Construction', role:'Graduate Engineer', minCgpa:6.5, branches:['Civil Engineering','Mechanical'], packageLpa:6.8, positions:6, maxBacklogs:1, status:'On hold', initials:'OS', color:'#9494AC' },
]
const extraCompanies: Company[] = Array.from({length:36},(_,i)=>{
  const index=i+7
  const names=['Pioneer Digital','Cedar Works','Lumen Analytics','Brightside Health','Bluepeak Networks','Orbit Commerce','Fieldstone Group','Evergreen Robotics','Kite & Key','Summit Consulting','Redwood Energy','Cobalt Technologies']
  const companyName=`${names[i%names.length]}${i>=names.length?` ${Math.floor(i/names.length)+1}`:''}`
  return {id:`co-${index}`,name:companyName,industry:['Technology','Consulting','Manufacturing','Financial Services','Healthcare'][i%5],role:['Associate Engineer','Data Analyst','Graduate Consultant','Product Associate','Systems Engineer'][i%5],minCgpa:[6,6.5,7,7.5][i%4],branches:branches.slice(i%3,Math.min(branches.length,(i%3)+3)),packageLpa:Number((6.5+(i%14)*0.7).toFixed(1)),positions:4+(i%17),maxBacklogs:i%3===0?1:0,status:(i%8===0?'On hold':'Active') as Company['status'],initials:companyName.split(' ').map(p=>p[0]).slice(0,2).join('').toUpperCase(),color:['#6857E8','#7E8097','#A8A8B8','#74758C','#9494AC'][i%5]}
})
companies.push(...extraCompanies)

const drives: PlacementDrive[] = [
  { id:'dr-1', companyId:'co-1', jobTitle:'Software Engineer', description:'Build dependable products with a small, high-trust engineering team.', date:'2026-11-04', deadline:'2026-11-01', minCgpa:7, branches:companies[0].branches, packageLpa:18, openings:12, stage:'Registration Open', graduationYear:2026, maxBacklogs:0 },
  { id:'dr-2', companyId:'co-2', jobTitle:'Graduate Analyst', description:'Turn complex data into clear decisions for our investment teams.', date:'2026-11-07', deadline:'2026-11-03', minCgpa:7.5, branches:companies[1].branches, packageLpa:14, openings:8, stage:'Upcoming', graduationYear:2026, maxBacklogs:0 },
  { id:'dr-3', companyId:'co-3', jobTitle:'Associate Developer', description:'Join a product squad delivering modern enterprise software.', date:'2026-10-30', deadline:'2026-10-28', minCgpa:6.5, branches:companies[2].branches, packageLpa:10.5, openings:18, stage:'Assessment', graduationYear:2026, maxBacklogs:1 },
  { id:'dr-4', companyId:'co-4', jobTitle:'Product Engineering Trainee', description:'Prototype and validate the next generation of connected vehicles.', date:'2026-11-12', deadline:'2026-11-08', minCgpa:7, branches:companies[3].branches, packageLpa:9, openings:10, stage:'Upcoming', graduationYear:2026, maxBacklogs:0 },
  { id:'dr-5', companyId:'co-5', jobTitle:'Cloud Support Associate', description:'Help global customers design, launch, and maintain cloud workloads.', date:'2026-10-22', deadline:'2026-10-18', minCgpa:6, branches:companies[4].branches, packageLpa:7.5, openings:15, stage:'Results Declared', graduationYear:2026, maxBacklogs:0 },
]
const extraDrives: PlacementDrive[] = companies.slice(5).map((company,i)=>{
  const month=String(5+(i%7)).padStart(2,'0')
  const day=String(8+(i%18)).padStart(2,'0')
  const date=`2026-${month}-${day}`
  const deadlineDay=String(Math.max(1,Number(day)-4)).padStart(2,'0')
  return {id:`dr-${i+6}`,companyId:company.id,jobTitle:company.role,description:`Meet the ${companyNameForDescription(company.name)} team and explore a graduate opportunity built for curious problem solvers.`,date,deadline:`2026-${month}-${deadlineDay}`,minCgpa:company.minCgpa,branches:company.branches,packageLpa:company.packageLpa,openings:company.positions,stage:(['Upcoming','Assessment','Interview','Results Declared'] as const)[i%4],graduationYear:2026,maxBacklogs:company.maxBacklogs}
})
drives.push(...extraDrives)
function companyNameForDescription(name:string){return name.split(' ')[0]}

const selections: Selection[] = [
  ...students.slice(0, 8).map((s, i) => ({ id:`sel-${i+1}`, studentId:s.id, companyId:companies[i % 4].id, driveId:drives[i % 4].id, status:(i < 4 ? 'Offer Accepted' : 'Selected') as Selection['status'], updatedAt:`2026-10-${String(21 - i).padStart(2,'0')}` })),
  ...students.slice(8, 12).map((s, i) => ({ id:`sel-${i+9}`, studentId:s.id, companyId:companies[i % 3].id, driveId:drives[i % 3].id, status:(i === 1 ? 'Rejected' : 'Applied') as Selection['status'], updatedAt:`2026-10-${String(18 - i).padStart(2,'0')}` })),
]
selections.push(...students.slice(18,322).map((s,i)=>{
  const drive=drives[(i+4)%drives.length]
  const month=5+(i%6)
  return {id:`sel-${i+13}`,studentId:s.id,companyId:drive.companyId,driveId:drive.id,status:(['Selected','Offered','Offer Accepted'][i%3]) as Selection['status'],updatedAt:`2026-${String(month).padStart(2,'0')}-${String(4+(i%23)).padStart(2,'0')}`}
}))

export const initialDemoData: DemoData = {
  students, companies, drives, selections,
  academicYear:'2025–26', adminName:'Ananya Rao', email:'ananya.rao@campus.edu', notifications:true, theme:'System',
}
