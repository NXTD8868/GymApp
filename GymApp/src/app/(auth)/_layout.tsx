// app/(app)/_layout.tsx
import { authClient } from "@/lib/auth-client"; // import the auth client
import { Redirect, Stack } from "expo-router";

export default function AuthLayout() {
  const { data: session, isPending } = authClient.useSession();
  if (isPending) return null;                        // still checking — wait
  if (session) return <Redirect href="/" />; // no session → sign in
  return <Stack screenOptions={{ headerShown: false }} />;
}