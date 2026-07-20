import { View, Text, Pressable, Alert } from 'react-native'
import React, { useState } from 'react'
import { Modal } from 'react-native'
import { DraftExercise, Exercise } from '@/types'
import ExerciseSelector from '@/components/exercise-selector'
import { colors, fonts, spacing } from '@/constants/theme'
import { Card } from '@/components/card'
import ExerciseLoggingCard from '@/components/exercise-logging-card'
import { set } from 'zod'
import { fi } from 'zod/v4/locales'
const workout_tester = () => {
  const [exercisesSelectorOpen,setExercisesSelectorOpen] = useState(false)
  const [sessionExercises,setSessionExercises] = useState<DraftExercise[]>([])
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
  return (
    <View style={{backgroundColor:colors.background,flex:1,padding:spacing.md,gap:spacing.md}}>
      <Modal
      animationType='slide'
      visible={exercisesSelectorOpen}
      onRequestClose={()=>{
        Alert.alert('selector closed')
        setExercisesSelectorOpen(false)
      }}>
        <ExerciseSelector onClose={()=>setExercisesSelectorOpen(false)} 
        onSelect={(exs)=>setSessionExercises((prev)=>[
          ...prev,
          ...exs.map((ex)=>({exercise:ex,sets:[]}))])}>
        </ExerciseSelector>
      </Modal>
      <ExerciseLoggingCard onRemoveSet={removeSet} exerciseList={sessionExercises} onUpdateSet={updateSet} onRemoveExercise={removeExercise} onAddSet={addSet}></ExerciseLoggingCard>
      <Card style={{backgroundColor:colors.accent,alignItems:'center'}}>
        <Pressable onPress={()=>setExercisesSelectorOpen(true)}>
          <Text style={{fontFamily:fonts.bodyBold,color:colors.text,fontSize:16}}>Select exercises</Text>
        </Pressable>
      </Card>
    </View>
  )
}

export default workout_tester