import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, spacing } from '@/constants/theme'
import Calendar from '@/components/calender'

const history = () => {
  return (
    <SafeAreaView style={{flex:1,backgroundColor:colors.background,padding:spacing.md}}>
        <Calendar></Calendar>
    </SafeAreaView>
  )
}

export default history