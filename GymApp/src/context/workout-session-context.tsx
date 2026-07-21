
import { createContext, useContext, useState, ReactNode } from "react"
import { DraftExercise,Exercise } from "@/types"
import { useEffect } from "react"
type SessionContextValue = {
    sessionName: string
    setSessionName: (name: string) => void
    sessionExercises: DraftExercise[]
    isActive: boolean
    startedAt: number | null
    startSession: () => void
    endSession: () => void
    addSet: (exIndex: number) => void
    removeSet: (exIndex: number, setIndex: number) => void
    updateSet: (exIndex: number, setIndex: number, field: 'weight' | 'reps', value: string) => void
    removeExercise: (exIndex: number) => void
    addExercises: (exs: Exercise[]) => void
    elapsed: number
}

const SessionContext = createContext<SessionContextValue|null>(null)

export function WorkoutSessionProvider({ children }:{children:ReactNode}) {
    const [isActive, setIsActive] = useState(false)
    const [sessionExercises,setSessionExercises] = useState<DraftExercise[]>([])
    const [sessionName,setSessionName]= useState<string>('YOUR WORKOUT')
    const [startedAt, setStartedAt] = useState<number | null>(null)
    const [elapsed, setElapsed] = useState(0)
    const removeExercise = (exIndex: number) => {
        setSessionExercises((prev) => prev.filter((_, i) => i !== exIndex))
    }
    const addSet =(exIndex:number) =>{
        setSessionExercises((prev)=>prev.map((ex,i)=>
        i===exIndex?{...ex,sets:[...ex.sets,{weight:'',reps:''}]}:ex))
    }
    const removeSet =(exIndex:number,setIndex:number) =>{
        setSessionExercises((prev)=>prev.map((ex,i)=>
        i!==exIndex?ex:
        {...ex,sets:ex.sets.filter((_,si)=>si !== setIndex)}))
    }
    const updateSet=(exIndex:number,setIndex:number,field :'weight'|'reps',value:string)=>{
        setSessionExercises((prev)=>
        prev.map((ex,i)=>
            i!==exIndex?ex:{
            ...ex,
            sets:ex.sets.map((s,j)=>
            (j!==setIndex?s:{...s,[field]:value}))
        }))
    }
    const addExercises=(exs:Exercise[])=>{
        setSessionExercises((prev)=>[
          ...prev,
          ...exs.map((ex)=>({exercise:ex,sets:[]}))])
    }
    const startSession = () => { setStartedAt(Date.now()); setIsActive(true); setSessionExercises([]);setSessionName('YOUR WORKOUT') }
    const endSession = () => { setIsActive(false); setStartedAt(null); setSessionExercises([]);setElapsed(0) }
    useEffect(() => {
        if (!isActive || startedAt === null) return
        const id = setInterval(() => {
            setElapsed(Math.floor((Date.now() - startedAt) / 1000))
        }, 1000)
        return () => clearInterval(id)
        }, [isActive, startedAt])
    return (
        <SessionContext.Provider value={{elapsed, sessionName,setSessionName,sessionExercises, isActive, startedAt,addExercises, startSession, endSession, addSet,updateSet,removeSet,removeExercise }}>
        {children}
        </SessionContext.Provider>
  )
}

export const useWorkoutSession = () => {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useWorkoutSession must be used within a WorkoutSessionProvider')
  return ctx
}