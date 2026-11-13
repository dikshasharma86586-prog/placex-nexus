import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import {
  AlertCircle, ArrowRight, Bell, BriefcaseBusiness, Building2, Check, CheckCheck, ChartNoAxesCombined, ChevronDown, ChevronRight, ChevronsUpDown,
  CircleHelp, ClipboardCheck, Database, Ellipsis, GraduationCap, LayoutDashboard, LoaderCircle, LogOut, Menu, Moon, Search, Settings, Sun, X,
  PanelLeftClose, PanelLeftOpen, type LucideIcon,
} from 'lucide-react'
import { useStore } from './store'
import { Avatar, CompanyMark } from './components/ui'
import { ToastProvider, useToast } from './hooks/useToast'
import { initials } from './utils'
import { AnalyticsPage, CompaniesPage, Dashboard, DrivesPage, EligibilityPage, SelectionsPage, SettingsPage, StudentsPage } from './pages'

const navItems: {label:string; path:string; icon:LucideIcon}[] = [
  { label:'Overview', path:'/', icon:LayoutDashboard }, { label:'Students', path:'/students', icon:GraduationCap },
  { label:'Companies', path:'/companies', icon:Building2 }, { label:'Placement drives', path:'/drives', icon:BriefcaseBusiness },
  { label:'Eligibility checker', path:'/eligibility', icon:ClipboardCheck }, { label:'Selections & results', path:'/selections', icon:CheckCheck },
  { label:'Analytics & reports', path:'/analytics', icon:ChartNoAxesCombined }, { label:'Settings', path:'/settings', icon:Settings },
]
const pageNames: Record<string,string> = { '/':'Overview','/students':'Students','/companies':'Companies','/drives':'Placement drives','/eligibility':'Eligibility checker','/selections':'Selections & results','/analytics':'Analytics & reports','/settings':'Settings' }

export default function App() {
  return <ToastProvider>
    <Routes><Route element={<Shell/>}>
      <Route index element={<Dashboard/>}/><Route path="students" element={<StudentsPage/>}/>
      <Route path="companies" element={<CompaniesPage/>}/><Route path="drives" element={<DrivesPage/>}/>
      <Route path="eligibility" element={<EligibilityPage/>}/><Route path="selections" element={<SelectionsPage/>}/>
      <Route path="analytics" element={<AnalyticsPage/>}/><Route path="settings" element={<SettingsPage/>}/>
      <Route path="*" element={<Dashboard/>}/>
    </Route></Routes>
  </ToastProvider>
}

function Shell() {
  const { pathname } = useLocation(); const store = useStore(),toast=useToast()
  const [collapsed,setCollapsed] = useState(false); const [mobileOpen,setMobileOpen] = useState(false)
  const [query,setQuery] = useState(''); const [profileOpen,setProfileOpen] = useState(false); const [noticeOpen,setNoticeOpen] = useState(false)
  const [yearMenu,setYearMenu] = useState(false)
  const [systemDark,setSystemDark] = useState(()=>window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false)
  useEffect(()=>{const shortcut=(event:KeyboardEvent)=>{if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='k'){event.preventDefault();document.querySelector<HTMLInputElement>('.global-search input')?.focus()}};window.addEventListener('keydown',shortcut);return()=>window.removeEventListener('keydown',shortcut)},[])
  useEffect(()=>{const preference=window.matchMedia('(prefers-color-scheme: dark)');const update=(event:MediaQueryListEvent)=>setSystemDark(event.matches);setSystemDark(preference.matches);preference.addEventListener('change',update);return()=>preference.removeEventListener('change',update)},[])
  const effectiveTheme=store.theme==='System'?(systemDark?'dark':'light'):store.theme.toLowerCase()
  const toggleTheme=()=>store.updateSettings({theme:effectiveTheme==='dark'?'Light':'Dark'})
  useEffect(()=>{document.documentElement.dataset.theme=effectiveTheme},[effectiveTheme])
  const page = pageNames[pathname] ?? 'Overview'
  const matchingStudents=query.trim()?store.students.filter(student=>[student.name,student.rollNo,student.email].some(value=>value.toLowerCase().includes(query.toLowerCase()))).slice(0,3):[]
  const matchingCompanies=query.trim()?store.companies.filter(company=>[company.name,company.industry,company.role].some(value=>value.toLowerCase().includes(query.toLowerCase()))).slice(0,2):[]
  const matchingDrives=query.trim()?store.drives.filter(drive=>[drive.jobTitle,store.companies.find(company=>company.id===drive.companyId)?.name??''].some(value=>value.toLowerCase().includes(query.toLowerCase()))).slice(0,2):[]
  const hasSearchMatches=matchingStudents.length+matchingCompanies.length+matchingDrives.length>0
  return <div className="app-shell" data-theme={effectiveTheme}>
    <aside className={`sidebar ${collapsed?'collapsed':''} ${mobileOpen?'mobile-open':''}`}>
      <div className="brand-row"><Link to="/" className="brand-mark"><span className="brand-glyph">P</span><span className="brand-name">Place<span>X</span></span></Link><button className="icon-button collapse-button" onClick={()=>setCollapsed(v=>!v)} aria-label={collapsed?'Expand sidebar':'Collapse sidebar'}>{collapsed?<PanelLeftOpen size={18}/>:<PanelLeftClose size={18}/>}</button></div>
      <div className="workspace-switch"><div className="workspace-avatar">N</div><div className="workspace-copy"><strong>Northbridge University</strong><span>Placement cell</span></div><ChevronsUpDown size={15}/></div>
      <div className="nav-caption">WORKSPACE</div>
      <nav className="side-nav" aria-label="Main navigation">{navItems.map(({label,path,icon:Icon})=><NavLink onClick={()=>setMobileOpen(false)} key={path} to={path} title={collapsed?label:undefined} className={({isActive})=>`nav-link ${isActive?'active':''}`}><Icon size={18}/><span>{label}</span>{label==='Selections & results'&&<span className="nav-count">12</span>}</NavLink>)}</nav>
      <div className="sidebar-spacer"/>
      <div className="sidebar-help"><span className="help-icon"><CircleHelp size={17}/></span><span><b>Need a hand?</b><small>Visit our help center</small></span><ArrowRight size={15}/></div>
      <div className="sidebar-bottom"><div className="admin-avatar">{initials(store.adminName)}</div><div className="admin-copy"><strong>{store.adminName}</strong><span>Administrator</span></div><button className="icon-button" aria-label="Open profile menu" onClick={()=>setProfileOpen(v=>!v)}><Ellipsis size={18}/></button></div>
    </aside>
    {mobileOpen&&<button className="mobile-scrim" onClick={()=>setMobileOpen(false)} aria-label="Close navigation"/>}
    <main className="main-area">
      <header className="topbar"><button className="icon-button mobile-menu" onClick={()=>setMobileOpen(true)} aria-label="Open navigation"><Menu size={19}/></button><div className="breadcrumbs"><span>Workspace</span><ChevronRight size={14}/><strong>{page}</strong></div>
        <div className="topbar-actions"><div className="menu-anchor search-anchor"><div className="global-search"><Search size={16}/><input aria-label="Search students, companies, and placement drives" placeholder="Search anything..." value={query} onChange={event=>setQuery(event.target.value)}/><kbd>⌘ K</kbd>{query&&<button type="button" onClick={()=>setQuery('')} aria-label="Clear search"><X size={14}/></button>}</div>{query.trim()&&<div className="dropdown global-results">{matchingStudents.map(student=><Link key={student.id} to="/students" onClick={()=>setQuery('')}><Avatar name={student.name}/><span><b>{student.name}</b><small>{student.rollNo} · Student</small></span><ArrowRight size={13}/></Link>)}{matchingCompanies.map(company=><Link key={company.id} to="/companies" onClick={()=>setQuery('')}><CompanyMark company={company}/><span><b>{company.name}</b><small>{company.industry} · Company</small></span><ArrowRight size={13}/></Link>)}{matchingDrives.map(drive=><Link key={drive.id} to="/drives" onClick={()=>setQuery('')}><span className="search-drive-icon"><BriefcaseBusiness size={14}/></span><span><b>{drive.jobTitle}</b><small>{store.companies.find(company=>company.id===drive.companyId)?.name??'Company'} · Drive</small></span><ArrowRight size={13}/></Link>)}{!hasSearchMatches&&<div className="no-search-results">No students, companies, or drives matched “{query}”.</div>}</div>}</div>
          <div className="topbar-divider"/><div className="menu-anchor"><button className="year-select" onClick={()=>setYearMenu(v=>!v)}>{store.academicYear}<ChevronDown size={14}/></button>{yearMenu&&<div className="dropdown year-dropdown">{['2025–26','2024–25','2023–24'].map(year=><button key={year} onClick={()=>{store.updateSettings({academicYear:year});setYearMenu(false)}}>{year}{year===store.academicYear&&<Check size={14}/>}</button>)}</div>}</div>
          <button className="icon-button theme-toggle" onClick={toggleTheme} title={`Switch to ${effectiveTheme==='dark'?'light':'dark'} mode`} aria-label={`Switch to ${effectiveTheme==='dark'?'light':'dark'} mode`}>{effectiveTheme==='dark'?<Sun size={18}/>:<Moon size={18}/>}</button>
          <div className="menu-anchor"><button className="icon-button notification-button" aria-label="Notifications" onClick={()=>{if(store.notifications)setNoticeOpen(v=>!v);else toast('Notifications are turned off in your preferences')}}><Bell size={18}/>{store.notifications&&<i/>}</button>{noticeOpen&&store.notifications&&<div className="dropdown notice-dropdown"><div className="dropdown-title">Notifications <span className="badge badge-indigo">3 new</span></div><div className="notification-row"><span className="notice-dot indigo"/><div><strong>New company registered</strong><small>Cloudline joined your campus network · 2h ago</small></div></div><div className="notification-row"><span className="notice-dot green"/><div><strong>Drive registrations close soon</strong><small>Northstar Labs · deadline Nov 1</small></div></div><div className="notification-row"><span className="notice-dot amber"/><div><strong>Selection update</strong><small>4 students moved to interview · 1d ago</small></div></div><Link to="/settings" onClick={()=>setNoticeOpen(false)} className="dropdown-footer">Notification preferences <ArrowRight size={14}/></Link></div>}</div>
          <div className="menu-anchor"><button className="profile-trigger" onClick={()=>setProfileOpen(v=>!v)}><span className="admin-avatar small">{initials(store.adminName)}</span><ChevronDown size={14}/></button>{profileOpen&&<div className="dropdown profile-dropdown"><div className="profile-summary"><b>{store.adminName}</b><small>{store.email}</small></div><Link to="/settings" onClick={()=>setProfileOpen(false)}><Settings size={15}/>Profile settings</Link><button onClick={()=>{setProfileOpen(false);setNoticeOpen(false);toast('The demo workspace does not have a sign-in session')}}><LogOut size={15}/>Sign out <span className="muted">Demo</span></button></div>}</div>
        </div>
      </header>
      <div className={`backend-banner ${store.connection}`} role="status"><span className="backend-banner-icon">{store.connection==='connecting'?<LoaderCircle size={15}/>:store.connection==='connected'?<Database size={15}/>:<AlertCircle size={15}/>}</span><span>{store.connectionMessage}</span>{store.connection==='fallback'&&<Link to="/settings">Connect backend <ArrowRight size={13}/></Link>}</div>
      {!store.ready&&<div className="loading-line"/>}
      <div className="page-wrap"><Outlet context={{query}}/></div>
      <footer className="app-footer"><span>PlaceX <i>{store.connection==='connected'?'MySQL backend':store.connection==='error'?'Backend connection error':'Browser demo fallback'}</i></span><span>Placement office · {store.academicYear}</span></footer>
    </main>
  </div>
}

