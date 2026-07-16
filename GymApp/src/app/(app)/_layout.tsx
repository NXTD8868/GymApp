// app/(app)/_layout.tsx
import { authClient } from "@/lib/auth-client"; // import the auth client
import { Redirect, Tabs } from "expo-router";

export default function AppLayout() {
  const { data: session, isPending } = authClient.useSession();
  if (isPending) return null;                        // still checking — wait
  if (!session) return <Redirect href="/sign-in" />; // no session → sign in
  return <Tabs screenOptions={{ headerShown: false }} />;
}