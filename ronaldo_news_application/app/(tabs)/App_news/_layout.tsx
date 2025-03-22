import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="News" />
      <Stack.Screen name="reportagem" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
