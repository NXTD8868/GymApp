import { Platform } from 'react-native'
import { authClient } from '@/lib/auth-client'
import { API_BASE_URL } from '../../config'

export async function authedFetch(path: string, options: RequestInit = {}) {
  const isNative = Platform.OS !== 'web'

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  }

  if (isNative) {
    headers['Cookie'] = authClient.getCookie()   // native: manual cookie
  }

  return fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: isNative ? 'omit' : 'include',   // native: omit; web: include
  })
}