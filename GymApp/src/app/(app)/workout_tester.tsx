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
import { useWorkoutSession } from '@/context/workout-session-context'
import { useRouter } from 'expo-router'
import { workoutObject } from '@/types'
import { API_BASE_URL } from '../../../config'
import { authedFetch } from '@/lib/authenticated-fetch'
const workout_tester = () => {
  const {
    isActive, startedAt,
    sessionName, setSessionName,
    elapsed,
    sessionExercises,
    addSet, removeSet, updateSet, removeExercise, addExercises,
    startSession, endSession,
  } =useWorkoutSession()
  const [exercisesSelectorOpen,setExercisesSelectorOpen] = useState(false)
  const nameInputRef = useRef<TextInput>(null)
  const [pendingSet, setPendingSet] = useState<{ exIndex: number; setIndex: number } | null>(null)
  const [cancelSessionDialogVisible,setCancelSessionDialogVisible] = useState<boolean>(false)
  const [finishSessionDialogVisible,setFinishSessionDialogVisible] = useState<boolean>(false)
  const requestRemoveSet = (exIndex: number, setIndex: number) => {
    setPendingSet({ exIndex, setIndex })
  }
  function formatTime(totalSeconds: number) {
    const mm = Math.floor(totalSeconds / 60)
    const ss = totalSeconds % 60
    return `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`
  }
  const router =useRouter()
  // in workout-session-context
  const finishWorkout = async () => {
    const candidate = {
      sessionName: sessionName,
      startedAt: new Date(startedAt!),
      endedAt: new Date(),
      exercises: sessionExercises
        .filter((ex) => ex.sets.length > 0)
        .map((ex) => ({
          exerciseKey: ex.exercise.key,
          sets: ex.sets.map((s) => ({ weight: Number(s.weight), reps: Number(s.reps) }))
          .filter((s) => !Number.isNaN(s.weight) && !Number.isNaN(s.reps) && s.reps > 0),
        })).filter((ex) => ex.sets.length > 0),
    }
    const result = workoutObject.safeParse(candidate)
    if (!result.success) 
      return { ok: false, errors: result.error.issues }
    try {
      const res = await authedFetch(`/workouts/`,{
        method:'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(result.data), 
        });
      if (!res.ok) {
        return { ok: false as const, errors: `Server error: ${res.status}` }
      }
      endSession()                      
      return { ok: true as const }
    } catch (err) {
      return { ok: false as const, errors: 'Network error' }
    }
  }
  return (
    <SafeAreaView edges={['top']} style={{backgroundColor:colors.background,flex:1,padding:spacing.md,gap:spacing.md}}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: spacing.sm }}>
        <Pressable style={{ flex: 1 }} onPress={() => {if (isActive) setCancelSessionDialogVisible(true)}}>
          <Ionicons name="close" size={28} color={isActive?colors.accent: colors.textMuted} />
        </Pressable>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ fontFamily: fonts.bodyBold, fontSize: 11, letterSpacing: 2, color: colors.textMuted }}>TIMER</Text>
          <Text style={{ fontFamily: fonts.headingHeavy, fontSize: 16, color: colors.accent }}>  {formatTime(elapsed)}</Text>
        </View>
        <Pressable style={{ flex: 1, alignItems: 'flex-end' }} onPress={() => { if(!isActive) startSession()}}>
          <Text style={{ fontFamily: fonts.headingHeavy, fontSize: 16, color: !isActive?colors.accent:colors.textMuted }}>START</Text>
        </Pressable>
        <Pressable style={{ flex: 1, alignItems: 'flex-end' }} onPress={() => {if (isActive) setFinishSessionDialogVisible(true)}}>
          <Text style={{ fontFamily: fonts.headingHeavy, fontSize: 16, color:isActive?colors.accent:colors.textMuted }}>FINISH</Text>
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
        onSelect={addExercises}>
        </ExerciseSelector>
      </Modal>
      <ExerciseLoggingCard onRemoveSet={requestRemoveSet} exerciseList={sessionExercises} onUpdateSet={updateSet} onRemoveExercise={removeExercise} onAddSet={addSet}></ExerciseLoggingCard>
      <Card style={{backgroundColor:colors.accent,alignItems:'center'}}>
        <Pressable onPress={()=>setExercisesSelectorOpen(true)}>
          <Text style={{fontFamily:fonts.bodyBold,color:colors.text,fontSize:16}}>Select exercises</Text>
        </Pressable>
      </Card>

      <ConfirmDialog
      visible={finishSessionDialogVisible}
      icon='checkmark' title="Finish workout?"
      description="This workout session will be saved"
      confirmLabel="Finish" cancelLabel="Cancel"
      destructive
      onConfirm={async () => {
        const res =await finishWorkout()
        setFinishSessionDialogVisible(false)
          if (res.ok) {
          router.replace('/')                   
          } else {
            Alert.alert('Save failed', 'Your workout could not be saved. Please try again.')
      }
      }}
      onCancel={() => setFinishSessionDialogVisible(false)}
      />
      <ConfirmDialog
      visible={pendingSet !== null}
      icon="trash" title="Remove set?"
      description="This set will be removed from the exercise."
      confirmLabel="Remove" cancelLabel="Cancel"
      destructive={false}
      onConfirm={() => {
        if (pendingSet) removeSet(pendingSet.exIndex, pendingSet.setIndex)
        setPendingSet(null)
      }}
      onCancel={() => setPendingSet(null)}
      />
      <ConfirmDialog
      visible={cancelSessionDialogVisible}
      icon='exit' title="Cancel session"
      description="Exit this workout without saving"
      confirmLabel='Exit' cancelLabel="Cancel"
      destructive
      onConfirm={() => {
        endSession()
        setCancelSessionDialogVisible(false)
        router.push('/')
      }}
      onCancel={() =>setCancelSessionDialogVisible(false)}
      />
      <Card onPress={()=>console.log(elapsed,sessionName,sessionExercises)} style={{backgroundColor:colors.accent}}>
          <Text style={{color:colors.text,fontSize:20}}>click to test</Text>
      </Card>
    </SafeAreaView>
  )
}

export default workout_tester