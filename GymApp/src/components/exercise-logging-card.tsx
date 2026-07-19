import { View, Text, FlatList, Pressable, TextInput } from 'react-native'
import React from 'react'
import { colors, fonts, spacing } from '@/constants/theme'
import { Card } from '@/components/card'
import { DraftExercise, Exercise } from '@/types'
import { Ionicons } from '@expo/vector-icons'
import Index from '@/app/(app)'

const ExerciseLoggingCard = ({exerciseList,onRemoveExercise,onAddSet,onUpdateSet}:{
  exerciseList:DraftExercise[]
  onRemoveExercise: (exIndex:number)=>void
  onAddSet:(exIndex:number)=>void
  onUpdateSet:(exIndex:number,setIndex:number,field :'weight'|'reps',value:string)=>void})=> {
  return (
      <FlatList
      contentContainerStyle={{gap:spacing.md}}
      data={exerciseList}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item,index})=>{
        return (
          <Card style={{flexDirection:'column',gap:spacing.md}}>
            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
              <Text style={{fontFamily:fonts.heading,color:colors.text,fontSize:20}}>{item.exercise.exerciseName}</Text>
            <Pressable onPress={()=>onRemoveExercise(index)}>
              <Ionicons name='close' size={24} color={colors.textMuted}></Ionicons>
            </Pressable>
            </View>
            <View style={{ flexDirection: 'row' ,gap:spacing.sm}}>
              <Text style={{ flex: 1, color: colors.textDim, fontFamily: fonts.body,textAlign:'center' }}>SET</Text>
              <Text style={{ flex: 2, color: colors.textDim, fontFamily: fonts.body,textAlign:'center' }}>WEIGHT (KG)</Text>
              <Text style={{ flex: 2, color: colors.textDim, fontFamily: fonts.body,textAlign:'center' }}>REPS</Text>
            </View>
            {item.sets.map((set,setIndex)=>(
              <View key={setIndex} style={{flexDirection:'row',gap:spacing.sm}}>
                <Card padded={false} raised={true} style={{flex:1,alignItems:'center',height:32,justifyContent:'center'}}>
                  <Text style={{fontFamily:fonts.body,color:colors.text,fontSize:18}}>{setIndex+1}</Text>
                </Card>
                <Card padded={false} style={{backgroundColor:colors.background,flex:2}}>
                  <TextInput
                  style={{textAlign:'center',flex:1,color:colors.text,height:32,fontSize:18}}
                  placeholder='0'
                  keyboardType='numeric'
                  placeholderTextColor={colors.textMuted}
                  onChangeText={(v)=>onUpdateSet(index,setIndex,'weight',v)}
                  value={set.weight}></TextInput>
                </Card>
                <Card padded={false} style={{backgroundColor:colors.background,flex:2}}>
                  <TextInput
                  style={{textAlign:'center',flex:1,color:colors.text,height:32,fontSize:18}}
                  placeholder='0'
                  keyboardType='numeric'
                  placeholderTextColor={colors.textMuted}
                  onChangeText={(v)=>onUpdateSet(index,setIndex,'reps',v)}
                  value={set.reps}></TextInput>
                </Card>
              </View>
            ))}
            <Card onPress={()=>onAddSet(index)} padded={false} style={{borderWidth:2,borderColor:colors.textMuted,alignItems:'center'}}>
              <Text style={{fontFamily:fonts.headingHeavy,fontSize:24,color:colors.textMuted}}>+ ADD SET</Text>
            </Card>
            
          </Card>
        )
      }}>
      </FlatList>
  )
}

export default ExerciseLoggingCard