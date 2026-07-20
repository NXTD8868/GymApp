import { Platform } from 'react-native'

export const API_BASE_URL = Platform.select({
  android: 'http://10.0.2.2:3000/api',   // Android emulator → host machine
  ios:  process.env.EXPO_BASE_URL,       // iOS simulator can use localhost directly
  default: process.env.EXPO_BASE_URL,   // web
})
