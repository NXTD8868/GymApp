import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { colors } from '@/constants/theme'
import { Exercise } from '@/types'

const testscreen = () => {
  const [exerciseList,setExerciseList] = useState<Exercise[]>([])
  return (
    <View style={{backgroundColor:colors.background}}>
    </View>
  )
}

export default testscreen