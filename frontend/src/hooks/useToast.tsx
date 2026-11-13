import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { Check, X, XCircle } from 'lucide-react'

type ToastItem = { id:number; message:string; tone:'success'|'error' }
const ToastContext = createContext<(message:string, tone?:'success'|'error')=>void>(()=>{})

export function ToastProvider({children}:{children:ReactNode}) {
  const [toasts,setToasts]=useState<ToastItem[]>([])
  const toast=useCallback((message:string,tone:'success'|'error'='success')=>{
    const id=Date.now()+Math.random()
    setToasts(prev=>[...prev,{id,message,tone}])
    window.setTimeout(()=>setToasts(prev=>prev.filter(item=>item.id!==id)),3400)
  },[])
  return <ToastContext.Provider value={toast}>{children}<div className="toast-stack" aria-live="polite">{toasts.map(item=><div className={`toast ${item.tone}`} key={item.id}>{item.tone==='success'?<Check size={17}/>:<XCircle size={17}/>}<span>{item.message}</span><button aria-label="Dismiss" onClick={()=>setToasts(prev=>prev.filter(t=>t.id!==item.id))}><X size={15}/></button></div>)}</div></ToastContext.Provider>
}

export function useToast(){return useContext(ToastContext)}
