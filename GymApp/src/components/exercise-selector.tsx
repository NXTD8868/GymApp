import APITestingButton from '@/components/api-testing-button'
import { Card } from '@/components/card'
import { colors, fonts, spacing } from '@/constants/theme'
import { Ionicons } from '@expo/vector-icons'
import { useState,useEffect } from 'react'
import { Text, View,TextInput, Pressable, FlatList } from 'react-native'
import { Exercise } from '@/types'
import { SectionList } from 'react-native'
import { API_BASE_URL } from '../../config'
import { authedFetch } from '@/lib/authenticated-fetch'
const ExerciseSelector = ({onSelect,onClose} :{
  onSelect:(ex:Exercise[])=>void
  onClose: ()=> void
}) => {
  const [searchBar,setSearchBar] = useState('')
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [userSelectedexercise,setUserSelectedExercise] = useState<Exercise[]>([])
  const [muscleGroupFilter,setMuscleGroupFilter] = useState('All')
  const fetchExerciseCatalog = async ()=>{
    try {
      setLoading(true);
      const res = await authedFetch(`/workouts/exercises`,{method:'GET'})
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      const data = await res.json();
      setExercises(data.res ?? []);
    }
    catch (err) {
      console.error('Failed to fetch exercises:', err);
    }
    finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    fetchExerciseCatalog()
  }, [])
  const muscleGroups = ['All',...new Set(exercises.map((ex) => ex.muscleGroup))]
  const visibleExercises = exercises.filter((ex) => {
    const matchesGroup = muscleGroupFilter === 'All' || ex.muscleGroup === muscleGroupFilter
    const matchesSearch = ex.exerciseName
      .toLowerCase()
      .includes(searchBar.toLowerCase())
    return matchesGroup && matchesSearch
  })
  const sections = Object.entries(
    visibleExercises.reduce<Record<string, Exercise[]>>((acc, ex) => {
      (acc[ex.muscleGroup] ??= []).push(ex)
      return acc
    }, {})
  ).map(([title, data]) => ({ title, data }))
  return (
    <View style={{backgroundColor:colors.background,flex:1,justifyContent:'flex-start',padding:spacing.md,gap:spacing.md}}> 
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{fontFamily:fonts.headingHeavy,color:colors.text,fontSize:24}}>
            ADD EXERCISE
        </Text>
        <Pressable onPress={()=>onClose()}>
            <Ionicons name='close' size={24} color={colors.textMuted}></Ionicons>
        </Pressable>
      </View>
      <Card style={{flexDirection:'row',gap:spacing.sm}}>
            <Ionicons name='search' size={20} color={colors.textMuted} />      
            <TextInput 
              value={searchBar}
              onChangeText={setSearchBar}
              placeholder='Search exercise'
              placeholderTextColor={colors.textMuted}
              style={{fontFamily:fonts.body,color:colors.textMuted,fontSize:16,alignItems:'center'}}>
            </TextInput>
      </Card>
      <FlatList 
      style={{flexGrow:0}}
      data={muscleGroups  }
      keyExtractor={(group)=>group}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{gap:spacing.sm}}
      renderItem={({item})=>{
        const active = item ===muscleGroupFilter
        return (
        <Card onPress={()=>setMuscleGroupFilter(item)} style={{backgroundColor:active? colors.accent:colors.surfaceRaised}}>
          <Text style={{color:active?colors.background:colors.textMuted, fontFamily:active?fonts.bodyBold:fonts.body}}>{item}</Text>
        </Card>
      )}}>
      </FlatList>
      <SectionList
      style={{flex:1}}
      sections={sections}
      keyExtractor={(ex) => String(ex.key)}
      contentContainerStyle={{gap:spacing.sm}}
      renderSectionHeader={({ section }) => (
        <Text style={{ color: colors.textMuted, fontFamily: fonts.body }}>
          {section.title.toUpperCase()}
        </Text>
      )}
      renderItem={({ item }) => {
        const selected =userSelectedexercise.some((e)=>e.key===item.key)
        return (
        <Card onPress={()=>setUserSelectedExercise((prev)=>selected?prev.filter((e)=>e.key!=item.key):[...prev,item])}
        style={{flexDirection:'row',justifyContent:'space-between'}}>
            <View>
                <Text style={{ color: colors.text,fontFamily:fonts.bodyBold}}>
                    {item.exerciseName}
                </Text>
                <Text style={{ color: colors.textMuted,fontFamily:fonts.body }}>
                    {item.muscleGroup}
                </Text>
            </View>
            <Ionicons name={selected ? 'checkmark-circle' : 'add-circle-outline'} size={24} color={selected?colors.accent:colors.textMuted}></Ionicons>
        </Card>
      )}}
    />
    <Card style={{backgroundColor:userSelectedexercise.length?colors.accent:colors.surfaceRaised,justifyContent:'center'}}
    onPress={()=>{
        if (userSelectedexercise.length) {
            onSelect(userSelectedexercise)
            onClose()
        }
    }}>
        <Text style={{fontFamily:fonts.headingHeavy,color:colors.background,fontSize:24,alignSelf:'center'}}>
            ADD {userSelectedexercise.length} EXERCISE{userSelectedexercise.length === 1 ? '' : 'S'}
        </Text>
    </Card>
    </View>
  )
}

export default ExerciseSelector