import { colors, spacing } from '@/constants/theme';
import { Pressable, Text, View } from 'react-native';
type APITestingButtonProps = {
  APIfunc:  () => Promise<unknown> |void      
};
export default function APITestingButton({APIfunc}:APITestingButtonProps) {
    const handlePress = async() => {
    console.log('clicked');
    const res = await APIfunc();
    console.log('Res: ',res)
    };
  return (
    <View style={{backgroundColor:colors.accent, }}>
        <Pressable onPress={()=>handlePress()}>
            <Text style={{fontSize:spacing.lg}}>api-testing-button</Text>
        </Pressable>
    </View>
  )
}