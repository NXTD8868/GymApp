import APITestingButton from '@/components/api-testing-button';
import { authClient, useSession } from '@/lib/auth-client';
import { Text, View } from 'react-native';
import { colors, fonts, spacing } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/card';
import { LinearGradient } from 'expo-linear-gradient';
import { useWorkoutSession } from '@/context/workout-session-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
const Index = () => {
  const router=useRouter()
  const { data: session, isPending } = authClient.useSession();
  const {startSession,isActive} = useWorkoutSession()
  const name= session?.user.name
  function formatDate(date: Date) {
    const weekday = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()  
    const day = date.getDate()                                                           
    const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()     
    return `${weekday} · ${day} ${month}`
  }

  function Greeting(date: Date) {
    const hour = date.getHours()  
    let period: string 
    if (hour < 12) {
        period = 'MORNING'      // 00:00–11:59
      } else if (hour < 17) {
        period = 'AFTERNOON'    // 12:00–16:59
      } else {
        period = 'EVENING'      // 17:00–23:59
      }                                                        
    return `GOOD ${period}`
  }
  const onLogOut = async()=> {
    await authClient.signOut();
    console.log('session after signOut:', session)


  }
  if (isPending) return <Text>Loading...</Text>;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background,gap:spacing.sm,padding:spacing.md }} edges={['top']}>
      <View style={{flexDirection:'row',alignSelf:'flex-start',padding:spacing.md}}>
        <View style={{flex:4}}>
          <Text style={{fontFamily:fonts.headingHeavy,color:colors.textMuted,fontSize:20}}>{formatDate(new Date())}</Text>
          <Text style={{ fontFamily: fonts.heading, color: colors.text, fontSize: 36 }}>
            {Greeting(new Date())}, {name?.toUpperCase()}
          </Text>
        </View>
        <View style={{flex:1}}>
          {/* Profile pic */}
          <APITestingButton name='Log out' APIfunc={()=>onLogOut()}></APITestingButton>
        </View>
      </View>
        <Card style={{ width: '80%', alignSelf: 'center',alignItems:'center' }}>

          <Text style={{fontFamily:fonts.body,color:colors.text,fontSize:16}}>Streak</Text>
        </Card>
        <LinearGradient
          colors={['#FF5A1F', '#FF8330']}
          start={{ x: 0, y: 0 }}      // top-left
          end={{ x: 1, y: 1 }}        // bottom-right → diagonal (~135°, close to the design's 150°)
          style={{ borderRadius: 26, padding: 22, overflow: 'hidden', position: 'relative' }}
        >
          {/* decorative circle, clipped by overflow:hidden */}
          <View style={{
            position: 'absolute',
            right: -30, top: -30,
            width: 140, height: 140, borderRadius: 70,
            backgroundColor: 'rgba(255,255,255,0.12)',
          }} />

          {/* card content — TODAY'S SESSION, Push Day, etc. */}
          <Text style={{ color: colors.text, fontFamily: fonts.bodyBold, fontSize: 12, letterSpacing: 1 }}>
            TODAY'S SESSION
          </Text>
          <Text style={{ color:  colors.text, fontFamily: fonts.headingHeavy, fontSize: 28 }}>Push Day</Text>
          <Card onPress={()=>{
            if (!isActive) startSession()
              router.push('/Live_Log')
            }} 
            style={{backgroundColor:colors.background,alignItems:'center',flexDirection:'row',gap:spacing.md}}>
            <Ionicons
              name={isActive ? 'pulse' : 'play'}
              size={20}
              color={isActive ? colors.accent : colors.text}
            />
            <Text style={{fontFamily:fonts.heading,color:colors.text,fontSize:20}}>{!isActive?'START WORKOUT':'SESSION IN PROGRESS'}</Text>
          </Card>
        </LinearGradient>
    </SafeAreaView>

  )
}

export default Index