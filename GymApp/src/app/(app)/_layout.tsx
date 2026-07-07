// app/(app)/_layout.tsx
import { Redirect, Stack } from "expo-router";

export default function AppLayout() {
  const isLoggedIn = false;
  if (!isLoggedIn) return <Redirect href="/sign-in" />;
  return <Stack screenOptions={{ headerShown: false }} />;
}