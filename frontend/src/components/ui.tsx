import { useEffect, useRef, type CSSProperties, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from 'react'
import { ArrowRight, Search, X, type LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Company } from '../types'
import { initials } from '../utils'

export function PageHeading({eyebrow,title,description,action}:{eyebrow?:string;title:string;description?:string;action?:ReactNode}) {
  return <div className="page-heading"><div>{eyebrow&&<div className="eyebrow">{eyebrow}</div>}<h1>{title}</h1>{description&&<p>{description}</p>}</div>{action&&<div className="heading-actions">{action}</div>}</div>
}
export function Button({children,onClick,variant='primary',icon:Icon,disabled,type='button',className=''}:{children:ReactNode;onClick?:()=>void;variant?:'primary'|'secondary'|'ghost'|'danger'|'subtle';icon?:LucideIcon;disabled?:boolean;type?:'button'|'submit';className?:string}) {
  return <button type={type} disabled={disabled} onClick={onClick} className={`button button-${variant} ${className}`}>{Icon&&<Icon size={16}/ >}{children}</button>
}
export function Panel({children,className='',title,subtitle,action}:{children:ReactNode;className?:string;title?:string;subtitle?:string;action?:ReactNode}) {
  return <section className={`panel ${className}`}>{(title||action)&&<div className="panel-head"><div>{title&&<h2>{title}</h2>}{subtitle&&<p>{subtitle}</p>}</div>{action}</div>}{children}</section>
}
export function EmptyState({icon:Icon=Search,title,copy,action}:{icon?:LucideIcon;title:string;copy:string;action?:ReactNode}) { return <div className="empty-state"><span><Icon size={22}/></span><strong>{title}</strong><p>{copy}</p>{action}</div> }
export function Modal({title,subtitle,children,onClose,wide=false}:{title:string;subtitle?:string;children:ReactNode;onClose:()=>void;wide?:boolean}) {
  const dialog=useRef<HTMLElement>(null),closeRef=useRef(onClose)
  useEffect(()=>{closeRef.current=onClose},[onClose])
  useEffect(()=>{
    const element=dialog.current
    const focusables=()=>Array.from(element?.querySelectorAll<HTMLElement>('button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),a[href],[tabindex]:not([tabindex="-1"])')??[])
    const initial=element?.querySelector<HTMLElement>('[autofocus]')??focusables()[0]
    initial?.focus()
    const onKeyDown=(event:KeyboardEvent)=>{
      if(event.key==='Escape'){event.preventDefault();closeRef.current();return}
      if(event.key==='Tab'){
        const items=focusables();if(!items.length)return
        const first=items[0],last=items[items.length-1]
        if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
        else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
      }
    }
    document.addEventListener('keydown',onKeyDown)
    return()=>document.removeEventListener('keydown',onKeyDown)
  },[])
  return <div className="modal-backdrop" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}><section ref={dialog} className={`modal ${wide?'modal-wide':''}`} role="dialog" aria-modal="true" aria-label={title} tabIndex={-1}><header><div><h2>{title}</h2>{subtitle&&<p>{subtitle}</p>}</div><button className="icon-button" onClick={onClose} aria-label="Close dialog"><X size={18}/></button></header>{children}</section></div>
}
export function Field({label,children,help,error}:{label:string;children:ReactNode;help?:string;error?:string}) { return <label className="field"><span>{label}</span>{children}{error?<small className="field-error">{error}</small>:help&&<small>{help}</small>}</label> }
export function TextInput(props:InputHTMLAttributes<HTMLInputElement>) { return <input {...props} className={`input ${props.className??''}`}/> }
export function Select(props:SelectHTMLAttributes<HTMLSelectElement>) { return <select {...props} className={`input select ${props.className??''}`}/> }
export function StatusBadge({children,tone}:{children:ReactNode;tone?:string}) { return <span className={`status-badge ${tone??String(children).toLowerCase().replaceAll(' ','-')}`}>{children}</span> }
export function CompanyMark({company,size='normal'}:{company:Company;size?:'normal'|'large'}) { const palette=['var(--violet)','#7E8097','var(--peach-deep)','var(--coral-deep)','#AAA5C6'];const hash=[...company.id].reduce((value,character)=>value+character.charCodeAt(0),0);const index=hash%palette.length;return <span className={`company-mark ${size}`} style={{'--mark-color':palette[index]} as CSSProperties}>{company.initials}</span> }
export function Avatar({name,color='indigo'}:{name:string;color?:string}) { return <span className={`student-avatar ${color}`}>{initials(name)}</span> }
export function QuickAction({icon:Icon,title,subtitle,to}:{icon:LucideIcon;title:string;subtitle:string;to:string}){return <Link to={to} className="quick-action"><span><Icon size={17}/></span><div><strong>{title}</strong><small>{subtitle}</small></div><ArrowRight size={15}/></Link>}
export function Detail({label,value}:{label:string;value:string}){return <div className="detail-item"><small>{label}</small><strong>{value}</strong></div>}
export function Kpi({label,value,note,icon:Icon,tint}:{label:string;value:string;note:string;icon:LucideIcon;tint:string}){return <div className="analytics-kpi"><span className={`stat-icon ${tint}`}><Icon size={18}/></span><span className="kpi-label">{label}</span><strong>{value}</strong><small>{note}</small></div>}
export function Toggle({checked,onChange}:{checked:boolean;onChange:(value:boolean)=>void}){return <button type="button" role="switch" aria-checked={checked} className={`toggle ${checked?'on':''}`} onClick={()=>onChange(!checked)}><i/></button>}
export function ConfirmModal({title,copy,onCancel,onConfirm,confirmLabel='Delete'}:{title:string;copy:string;onCancel:()=>void;onConfirm:()=>void;confirmLabel?:string}){return <Modal title={title} subtitle={copy} onClose={onCancel}><div className="confirm-actions"><Button variant="secondary" onClick={onCancel}>Cancel</Button><Button variant="danger" onClick={onConfirm}>{confirmLabel}</Button></div></Modal>}
