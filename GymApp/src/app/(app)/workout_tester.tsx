import { View, Text, Pressable, Alert } from 'react-native'
import React, { useState } from 'react'
import { Modal } from 'react-native'
import { DraftExercise, Exercise } from '@/types'
import ExerciseSelector from '@/components/exercise-selector'
import { colors, fonts, spacing } from '@/constants/theme'
import { Card } from '@/components/card'
import ExerciseLoggingCard from '@/components/exercise-logging-card'
import { Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TextInput } from 'react-native'
import { useRef } from 'react'
import { ConfirmDialog } from '@/components/confirmation-dialog-popup'
const workout_tester = () => {
  const [exercisesSelectorOpen,setExercisesSelectorOpen] = useState(false)
  const [sessionExercises,setSessionExercises] = useState<DraftExercise[]>([])
  const [sessionName,setSessionName]= useState<string>('YOUR WORKOUT')
  const nameInputRef = useRef<TextInput>(null)
  const [pendingSet, setPendingSet] = useState<{ exIndex: number; setIndex: number } | null>(null)
  const requestRemoveSet = (exIndex: number, setIndex: number) => {
    setPendingSet({ exIndex, setIndex })
  }
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
    <SafeAreaView edges={['top']} style={{backgroundColor:colors.background,flex:1,padding:spacing.md,gap:spacing.md}}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: spacing.sm }}>
        <Pressable style={{ flex: 1 }} onPress={() => {/* close session */}}>
          <Ionicons name="close" size={28} color={colors.textMuted} />
        </Pressable>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ fontFamily: fonts.bodyBold, fontSize: 11, letterSpacing: 2, color: colors.textMuted }}>RECORDING</Text>
          <Text style={{ fontFamily: fonts.headingHeavy, fontSize: 16, color: colors.accent }}>00:00</Text>
        </View>
        <Pressable style={{ flex: 1, alignItems: 'flex-end' }} onPress={() => {/* finish */}}>
          <Text style={{ fontFamily: fonts.headingHeavy, fontSize: 16, color: colors.accent }}>FINISH</Text>
        </Pressable>
      </View>


      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
        <TextInput
          ref={nameInputRef}
          style={{ fontFamily: fonts.headingHeavy, fontSize: 30, color: colors.text,minWidth:0 ,flex:2}}
          placeholder="YOUR WORKOUT"
          placeholderTextColor={colors.textMuted}
          onChangeText={setSessionName}
          value={sessionName}
        />
        <Pressable onPress={() => nameInputRef.current?.focus()} style={{flex:1}}>
          <Ionicons name="pencil" size={20} color={colors.textMuted} />
        </Pressable>
      </View>
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
      <ExerciseLoggingCard onRemoveSet={requestRemoveSet} exerciseList={sessionExercises} onUpdateSet={updateSet} onRemoveExercise={removeExercise} onAddSet={addSet}></ExerciseLoggingCard>
      <Card style={{backgroundColor:colors.accent,alignItems:'center'}}>
        <Pressable onPress={()=>setExercisesSelectorOpen(true)}>
          <Text style={{fontFamily:fonts.bodyBold,color:colors.text,fontSize:16}}>Select exercises</Text>
        </Pressable>
      </Card>

      <ConfirmDialog
      visible={pendingSet !== null}
      icon="trash" title="Remove set?"
      description="This set will be removed from the exercise."
      confirmLabel="Remove" cancelLabel="Cancel"
      destructive
      onConfirm={() => {
        if (pendingSet) removeSet(pendingSet.exIndex, pendingSet.setIndex)
        setPendingSet(null)
      }}
      onCancel={() => setPendingSet(null)}
      />
    </SafeAreaView>
  )
}

export default workout_tester