import { View, Text, FlatList, Pressable, TextInput } from 'react-native'
import React from 'react'
import { colors, fonts, spacing } from '@/constants/theme'
import { Card } from '@/components/card'
import { DraftExercise, Exercise } from '@/types'
import { Ionicons } from '@expo/vector-icons'
import Index from '@/app/(app)'
import type { WorkoutDocument } from '@/types'
interface SessionCardProp {
  workoutDocument:WorkoutDocument,
  onClose : ()=>void
}
const SessionCard = ({workoutDocument,onClose}:SessionCardProp)=> {
  return (
    <View style={{flex:1,backgroundColor:colors.surface}}>
      <View style={{flexDirection:'row',justifyContent: 'space-between', alignItems: 'flex-end'}}>
        <Text style={{fontFamily:fonts.headingHeavy,color:colors.text,fontSize:30}}>
          {workoutDocument.sessionName}
        </Text>
        <Card onPress={()=>onClose()} style={{alignSelf:'flex-end'}}>
            <Ionicons name='close' size={24} color={colors.textMuted}></Ionicons>
        </Card>
      </View>

      <FlatList
      contentContainerStyle={{gap:spacing.md}}
      data={workoutDocument.exercises}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item,index})=>{
        return (
          <Card style={{flexDirection:'column',gap:spacing.md}}>
            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
              <Text style={{fontFamily:fonts.heading,color:colors.text,fontSize:20}}>{item.exerciseKey}</Text>
            </View>
            <View style={{ flexDirection: 'row' ,gap:spacing.sm}}>
              <Text style={{ flex: 1, color: colors.textDim, fontFamily: fonts.body,textAlign:'center' }}>SET</Text>
              <Text style={{ flex: 3, color: colors.textDim, fontFamily: fonts.body,textAlign:'center' }}>WEIGHT (KG)</Text>
              <Text style={{ flex: 3, color: colors.textDim, fontFamily: fonts.body,textAlign:'center' }}>REPS</Text>
            </View>
            {item.sets.map((set,setIndex)=>(
              <View key={setIndex} style={{flexDirection:'row',gap:spacing.sm}}>
                <Card padded={false} raised={true} style={{flex:1,alignItems:'center',height:32,justifyContent:'center'}}>
                  <Text style={{fontFamily:fonts.body,color:colors.text,fontSize:18}}>{setIndex+1}</Text>
                </Card>
                <Card padded={false} style={{backgroundColor:colors.background,flex:3}}>
                  <Text style={{textAlign:'center',flex:1,color:colors.text,height:32,fontSize:18}}>
                    {set.weight}
                  </Text>
                </Card>
                <Card padded={false} style={{backgroundColor:colors.background,flex:3}}>
                  <Text style={{textAlign:'center',flex:1,color:colors.text,height:32,fontSize:18}}>
                    {set.reps}
                  </Text>
                </Card>
              </View>
            ))}            
          </Card>
        )
      }}>
      </FlatList>
    </View>
      
  )
}

export default SessionCard