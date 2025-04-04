import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen name="user-type-screen" options={{ headerShown: false }} />
      <Stack.Screen name="user-signup" options={{ headerShown: false }} />
      <Stack.Screen name="user-signin" options={{ headerShown: false }} />
    </Stack>
  );
};

export default Layout;
