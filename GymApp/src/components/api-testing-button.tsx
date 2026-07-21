import { colors, fonts, spacing } from '@/constants/theme';
import { Pressable, Text, View } from 'react-native';
type APITestingButtonProps = {
  APIfunc:  () => Promise<unknown> |void,
  name :string    
};
export default function APITestingButton({APIfunc,name}:APITestingButtonProps) {
    const handlePress = async() => {
    console.log('clicked');
    const res = await APIfunc();
    console.log('Res: ',res)
    };
  return (
    <View style={{backgroundColor:colors.accent, }}>
        <Pressable onPress={()=>handlePress()}>
            <Text style={{fontSize:spacing.lg,fontFamily:fonts.heading,alignSelf:'center'}}>{name}</Text>
        </Pressable>
    </View>
  )
}