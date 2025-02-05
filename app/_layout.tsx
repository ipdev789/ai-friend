import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="screen/index" options={{ title: "index" }} />
      <Stack.Screen name="screen/singUp" options={{ title: "Sign Up" }} />
      <Stack.Screen name="screen/avatarCreation" options={{ title: "Avatar Creation" }} />
      <Stack.Screen name="screen/dashboard" options={{ title: "Dashbaord" }} />
    </Stack>
  );
}
