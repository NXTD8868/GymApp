import { View, Text, Pressable } from 'react-native'
import React, { useEffect } from 'react'
import { Card } from './card'
import { useState } from 'react'
import { colors, spacing } from '@/constants/theme'
import { Dimensions } from 'react-native'
interface CalendarProp {
    viewDate:Date,
    workoutDays :Set<number>,
    onDayPress?:(day:number)=>void
}
const Calendar = ({viewDate,workoutDays,onDayPress}:CalendarProp) => {
    function getMonthDays(year: number, month: number) {
        const firstDay = new Date(year, month, 1)
        const daysInMonth = new Date(year, month + 1, 0).getDate()
        let startWeekday = firstDay.getDay()
        startWeekday = startWeekday === 0 ? 6 : startWeekday - 1

    const cells: (number | null)[] = []
        for (let i = 0; i < startWeekday; i++) cells.push(null)
        for (let d = 1; d <= daysInMonth; d++) cells.push(d)
        return cells
    }
    const dayheader:string[]=['M','T','W','T','F','S','S']
    const cells = getMonthDays(viewDate.getFullYear(), viewDate.getMonth())
    const hasWorkout = (day: number) => workoutDays.has(day)
    const screenH = Dimensions.get('window').height
    const calendarH = screenH / 3        
    const rowH = calendarH / 7   
    return (
        <Card style={{flexDirection:'row',flexWrap:'wrap'}}>
            {dayheader.map((day,i)=>(
                <View key={i} style={{ height:rowH,width: '14.2857%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: colors.textMuted }}>{day}</Text>
                </View>
            ))}

            {cells.map((date,i)=>(
                <View key={i} style={{ height:rowH, width: '14.2857%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center' }}>
                        {date && (
                <View style={{
                    width: rowH-spacing.sm, height: rowH-spacing.sm, borderRadius: 16,
                    backgroundColor: hasWorkout(date) ? colors.accent : 'transparent',
                    alignItems: 'center', justifyContent: 'center',
                    }}>
                    <Pressable onPress={() => hasWorkout(date) && onDayPress?.(date)}>
                        <Text style={{ color: hasWorkout(date) ? colors.background : colors.text }}>{date}</Text>
                    </Pressable>
                    </View>)}
                </View>
            ))}

        
        </Card>
    )
    }

export default Calendar