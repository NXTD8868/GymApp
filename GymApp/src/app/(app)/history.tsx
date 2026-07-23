import { View, Text, Modal } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, fonts, spacing } from '@/constants/theme'
import Calendar from '@/components/calender'
import { useState } from 'react'
import { Card } from '@/components/card'
import { Ionicons } from '@expo/vector-icons'
import { WorkoutDocument } from '@/types'
import { authedFetch } from '@/lib/authenticated-fetch'
import { Pressable } from 'react-native'
import SessionCard from '@/components/session-card'
import { BlurView } from 'expo-blur'
import { StyleSheet } from 'react-native'
import { radius } from '@/constants/theme'
  const history = () => {
    
    const [workoutHistory,setWorkoutHistory]=useState<WorkoutDocument[]>([])
    const [viewDate, setViewDate] = useState(new Date())
    const [selectedDay, setSelectedDay] = useState<number | null>(null)
    const sessionsForDay = selectedDay
      ? workoutHistory.filter((w) => new Date(w.startedAt).getDate() === selectedDay)
      : []
    const movePrevMonth =()=>{
      setViewDate(new Date(viewDate.getFullYear(),viewDate.getMonth()-1,1))
    }
    const movNextMonth =()=>{
      setViewDate(new Date(viewDate.getFullYear(),viewDate.getMonth()+1,1))
    }
    const workoutDays = new Set(
      workoutHistory.map((session) => new Date(session.startedAt).getDate())
      )

    const [sessionIndex, setSessionIndex] = useState(0)
    useEffect(() => { setSessionIndex(0) }, [selectedDay])
    useEffect(()=>{
      setWorkoutHistory([])                         
      const fetchHistory  =  async()=>{
        try{
          const res = await authedFetch(`/workouts/history?year=${viewDate.getFullYear()}&month=${viewDate.getMonth()+1}`, { method: 'GET' })
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          const data = await res.json()
          setWorkoutHistory(data.res ?? [])   
        } catch (err){
          console.log('failed to fetch',err)
        }
      }
      fetchHistory()
      },[viewDate])
    useEffect(()=>{console.log(sessionsForDay)},[sessionsForDay])
  return (
    <SafeAreaView style={{flex:1,backgroundColor:colors.background,padding:spacing.md}}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Text style={{fontFamily:fonts.heading,color:colors.text,fontSize:30}}>HISTORY</Text>
        <View style={{flexDirection:'row',alignItems:'center'}}>
          <Card padded={false} onPress={movePrevMonth}>
            <Ionicons name='chevron-back' color={colors.text} size={30}></Ionicons>
          </Card>
          <Text style={{fontFamily:fonts.heading,color:colors.text,fontSize:30}}>{viewDate.toLocaleString('default', { month: 'long' })} {viewDate.getFullYear()} </Text>
          <Card padded={false} onPress={movNextMonth}>
            <Ionicons name='chevron-forward' color={colors.text} size={30}></Ionicons>
          </Card>
        </View>
      </View>
      <Calendar viewDate={viewDate} workoutDays={workoutDays} onDayPress={setSelectedDay}>

      </Calendar>

    <Modal visible={selectedDay !== null} transparent animationType="fade" onRequestClose={() => setSelectedDay(null)}>
      <Pressable
        onPress={() => setSelectedDay(null)}
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' }}
      >
        <Pressable onPress={() => {}} style={{ width: '90%', height: '80%' }}>
          <Card style={{ flex: 1, padding: spacing.md, gap: spacing.md }}>

            {/* header: close + counter */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ color: colors.textMuted, fontFamily: fonts.body }}>
                {sessionIndex + 1} of {sessionsForDay.length}
              </Text>
              <Pressable onPress={() => setSelectedDay(null)}>
                <Ionicons name="close" size={28} color={colors.textMuted} />
              </Pressable>
            </View>
            <View style={{ flex: 1 }}>
              {sessionsForDay[sessionIndex] && (
                <SessionCard onClose={()=>setSelectedDay(null)} workoutDocument={sessionsForDay[sessionIndex]} />
              )}
            </View>
            {sessionsForDay.length > 1 && (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Pressable
                  disabled={sessionIndex === 0}
                  onPress={() => setSessionIndex((i) => i - 1)}
                  style={{ opacity: sessionIndex === 0 ? 0.3 : 1 }}
                >
                  <Ionicons name="chevron-back" size={30} color={colors.accent} />
                </Pressable>

                <Pressable
                  disabled={sessionIndex === sessionsForDay.length - 1}
                  onPress={() => setSessionIndex((i) => i + 1)}
                  style={{ opacity: sessionIndex === sessionsForDay.length - 1 ? 0.3 : 1 }}
                >
                  <Ionicons name="chevron-forward" size={30} color={colors.accent} />
                </Pressable>
              </View>
            )}

          </Card>
        </Pressable>
      </Pressable>
    </Modal>
    </SafeAreaView>
  )
}

export default history