import { Archivo_400Regular, Archivo_700Bold, useFonts } from "@expo-google-fonts/archivo";
import { BarlowCondensed_700Bold, BarlowCondensed_800ExtraBold } from "@expo-google-fonts/barlow-condensed";
import { Stack } from "expo-router";
const RootLayout = () =>{
    const [loaded] = useFonts({
        Archivo_400Regular,
        Archivo_700Bold,
        BarlowCondensed_700Bold,
        BarlowCondensed_800ExtraBold,
    });
    if (!loaded) return null;
    return (
        <Stack screenOptions={{headerShown:false}}></Stack>
   ) 
}

export default RootLayout