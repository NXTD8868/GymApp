import APITestingButton from '@/components/api-testing-button';
import { authClient } from '@/lib/auth-client';
import { Text, View } from 'react-native';
import { colors } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
const Index = () => {
  const { data: session, isPending } = authClient.useSession();
  const onLogOut = async()=> {
    await authClient.signOut();
    console.log('session after signOut:', session)


  }
  if (isPending) return <Text>Loading...</Text>;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <View>
        <APITestingButton APIfunc={()=>onLogOut()}></APITestingButton>
      </View>
    </SafeAreaView>

  )
}

export default Index