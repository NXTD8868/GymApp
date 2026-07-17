import { View, Text, Pressable, Alert } from 'react-native'
import React, { useState } from 'react'
import { Modal } from 'react-native'
import { Exercise } from '@/types'
import ExerciseSelector from '@/components/exercise-selector'
import { colors, fonts } from '@/constants/theme'
import { Card } from '@/components/card'
const workout_tester = () => {
  const [exercisesSelectorOpen,setExercisesSelectorOpen] = useState(false)
  const [sessionExercises,setSessionExercises] = useState<Exercise[]>([])
  return (
    <View style={{backgroundColor:colors.background,flex:1,justifyContent:'center',alignItems:'center'}}>
      <Modal
      animationType='slide'
      visible={exercisesSelectorOpen}
      onRequestClose={()=>{
        Alert.alert('selector closed')
        setExercisesSelectorOpen(false)
      }}>
        <ExerciseSelector onClose={()=>setExercisesSelectorOpen(false)} onSelect={(ex)=>setSessionExercises((prev)=>[...prev,...ex])}>
        </ExerciseSelector>
      </Modal>
      <Card style={{backgroundColor:colors.accent}}>
        <Pressable onPress={()=>setExercisesSelectorOpen(true)}>
          <Text style={{fontFamily:fonts.bodyBold,color:colors.text,fontSize:16}}>Select exercises</Text>
        </Pressable>
      </Card>
      <Card style={{backgroundColor:colors.accent}}>
        <Pressable onPress={()=>console.log(sessionExercises)}>
          <Text style={{fontFamily:fonts.bodyBold,color:colors.text,fontSize:16}}>View</Text>
        </Pressable>
      </Card>
    </View>
  )
}

export default workout_tester