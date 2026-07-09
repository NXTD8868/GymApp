import APITestingButton from '@/components/api-testing-button';
import { authClient } from '@/lib/auth-client';
import { Text, View } from 'react-native';
const Index = () => {
  const { data: session, isPending } = authClient.useSession();
  const onLogOut = async()=> {
    await authClient.signOut();

  }
  if (isPending) return <Text>Loading...</Text>;

  return (
    <View>
        <APITestingButton APIfunc={()=>onLogOut()}></APITestingButton>
    </View>
  )
}

export default Index