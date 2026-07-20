import { Platform } from 'react-native'

export const API_BASE_URL = Platform.select({
  android: 'http://10.0.2.2:3000/api',  
  ios:  process.env.EXPO_PUBLIC_API_URL,      
  default: process.env.EXPO_PUBLIC_API_URL,  
})
