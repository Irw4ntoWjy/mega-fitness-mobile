import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="signIn/sign-in" />
      <Stack.Screen name="signUp/sign-up" />
      <Stack.Screen name="otp/otp" />
    </Stack>
  );
}
