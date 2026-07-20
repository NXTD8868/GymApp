import { createAuthClient } from "better-auth/react";
import { API_BASE_URL } from "../../config";
import { Platform } from "react-native";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";

const api_url = Platform.select({
  android: 'http://10.0.2.2:3000',   // Android emulator → host machine
  ios: 'http://localhost:3000',       // iOS simulator can use localhost directly
  default:'http://localhost:3000',   // web
})
export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: api_url,
    plugins:[
        expoClient({
            scheme: "gymapp",          // ← match app.json exactly
            storagePrefix: "gymapp",
            storage: SecureStore,
        })
    ]
})

export const { signIn, signUp, useSession } = authClient;
