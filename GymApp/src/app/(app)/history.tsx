import { View, Text, Modal, FlatList } from 'react-native'
import React, { useEffect, useRef } from 'react'
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
    const [recentSessions, setRecentSessions] = useState<WorkoutDocument[]>([])
    useEffect(() => {
      const fetchRecent = async () => {
        const res = await authedFetch('/workouts/history?limit=5', { method: 'GET' })
        if (!res.ok) return
        const data = await res.json()
        setRecentSessions(data.res ?? [])
      }
      fetchRecent()
    }, [])
  const monthStats = {
    sessions: workoutHistory.length,
    totalVolume: workoutHistory.reduce((sum, w) =>
      sum + w.exercises.reduce((exSum, ex) =>
        exSum + ex.sets.reduce((setSum, s) => setSum + s.weight * s.reps, 0), 0), 0),
    totalMs: workoutHistory.reduce((sum, w) =>
      sum + (new Date(w.endedAt).getTime() - new Date(w.startedAt).getTime()), 0),
    }

  const hours = Math.floor(monthStats.totalMs / 3_600_000);
  const mins = Math.floor((monthStats.totalMs % 3_600_000) / 60_000);
  const [selectedSession, setSelectedSession] = useState<WorkoutDocument | null>(null)
  const displayedSession = selectedSession ?? sessionsForDay[sessionIndex] ?? null
  const modalVisible = selectedSession !== null || selectedDay !== null
  return (
    <SafeAreaView style={{flex:1,backgroundColor:colors.background,padding:spacing.md,gap:spacing.md}}>
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
      <View style={{flexDirection:'row',gap:spacing.sm,alignItems:'center', justifyContent:'center'}}>
        <Card raised={true} style={{alignItems:'center',padding:5}}>
          <View style={{flexDirection:'row',gap:spacing.sm,alignItems:'center'}}>
            <Text style={{fontFamily:fonts.headingHeavy,color:colors.text,fontSize:30}}>
              {monthStats.totalVolume/1000} 
            </Text>
            <Text style={{fontFamily:fonts.headingHeavy,color:colors.textMuted,fontSize:20}}>
              K
            </Text>
          </View>

          <Text style={{fontFamily:fonts.body,color:colors.textMuted}}>
            VOLUME - KG
          </Text>
        </Card>
        <Card raised={true} style={{alignItems:'center',padding:5}}>
          <Text style={{fontFamily:fonts.headingHeavy,color:colors.text,fontSize:30}}>
            {monthStats.sessions}
          </Text>
          <Text style={{fontFamily:fonts.body,color:colors.textMuted}}>
            WORKOUTS
          </Text>
        </Card>
        <Card raised={true} style={{alignItems:'center',padding:5}}>
          <Text style={{fontFamily:fonts.headingHeavy,color:colors.text,fontSize:30}}>
            {hours}:{mins}
          </Text>
          <Text style={{fontFamily:fonts.body,color:colors.textMuted}}>
            TIME - HOURS
          </Text>
        </Card>
      </View>
      <View style={{flex:1}}>
        <Text style={{fontFamily:fonts.bodyBold,color:colors.text}}>Recent sessions</Text>
        <FlatList
        data={recentSessions}
        contentContainerStyle={{ gap: spacing.sm, padding: spacing.md }}
        keyExtractor={(item)=>item._id}
        renderItem={({item})=>{
          const date = new Date(item.startedAt)
          const dateInitial = date.toLocaleDateString('en-US', { weekday: 'short' })
          const totalVolume = item.exercises.reduce(
            (exSum,ex)=>exSum+ex.sets.reduce((setSum,s)=>setSum+s.reps*s.weight,0)
            ,0)/1000
          const totalTime =new Date(item.endedAt).getTime() - new Date(item.startedAt).getTime()
          const totalExerise = item.exercises.length
          const hours = Math.floor(totalTime / 3_600_000);
          const mins = Math.floor((totalTime % 3_600_000) / 60_000);
          return (
            <Card onPress={() => setSelectedSession(item)}>
              <View style={{flexDirection:'row',alignItems:'center',gap:spacing.md}}>
                <View style={{
                  width: 42, height: 42,
                  borderRadius: 13,
                  backgroundColor: colors.accentSoft,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Text style={{ fontFamily: fonts.headingHeavy, fontSize: 18, color: colors.accent }}>
                    {date.getDate()}
                  </Text>
                  <Text style={{ fontSize: 8, fontFamily: fonts.bodyBold, color: colors.accent, letterSpacing: 0.8 }}>
                    {dateInitial.toUpperCase()}
                  </Text>
                </View>
                <View style={{gap:spacing.sm,flex:1}}>
                  <Text style={{fontFamily:fonts.heading,color:colors.text,fontSize:20}}>
                    {item.sessionName}
                  </Text>
                  <Text style={{fontFamily:fonts.body,color:colors.textMuted}}>
                    {hours>0?`${hours}h `:``}{mins} min · {totalVolume}k kg · {totalExerise} exercises
                  </Text>
                </View>
                <Ionicons name='chevron-forward' style={{color:colors.textMuted,fontSize:20}}></Ionicons>
              </View>
              
            </Card>
        )
        }
     }></FlatList>
      </View>
      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => {setSelectedSession(null); setSelectedDay(null)}}>
        <Pressable
          onPress={() => {setSelectedDay(null) ;setSelectedSession(null)}}
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' }}
        >
          <Pressable onPress={() => {}} style={{ width: '90%', height: '80%' }}>
            <Card style={{ flex: 1, padding: spacing.md, gap: spacing.md }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                {selectedSession===null &&
                (<Text style={{ color: colors.textMuted, fontFamily: fonts.body }}>
                  {sessionIndex + 1} of {sessionsForDay.length}
                </Text>)}
                <Pressable onPress={() => {setSelectedDay(null) ;setSelectedSession(null)}}>
                  <Ionicons name="close" size={28} color={colors.textMuted} />
                </Pressable>
              </View>
              <View style={{ flex: 1 }}>
                {displayedSession && (
                  <SessionCard workoutDocument={displayedSession} />
                )}
              </View>
              {sessionsForDay.length > 1 && selectedSession === null && (
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