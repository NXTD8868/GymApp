import APITestingButton from '@/components/api-testing-button'
import { authClient } from '@/lib/auth-client'
import { Text, View } from 'react-native'
const Index = () => {
  const onLogOut = async()=> {
    await authClient.signOut();

  }
  return (
    <View>
      <Text>index</Text>
      <APITestingButton APIfunc={()=>onLogOut()}></APITestingButton>
    </View>
  )
}

export default Index