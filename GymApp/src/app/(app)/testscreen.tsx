import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { colors, fonts } from '@/constants/theme'
import { Exercise } from '@/types'
import { useWorkoutSession } from '@/context/workout-session-context'
import { Card } from '@/components/card'
const testscreen = () => {
  const [exerciseList,setExerciseList] = useState<Exercise[]>([])
  const {sessionName} =useWorkoutSession()
  return (
    <View style={{backgroundColor:colors.background}}>
      <Card>
        <Text style={{fontFamily:fonts.heading,fontSize:20,color:colors.text}}>{sessionName}</Text>
      </Card>
    </View>
  )
}

export default testscreen