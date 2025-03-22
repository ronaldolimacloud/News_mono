import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: true,
          headerTitle: "Ronaldo's News",
          headerStyle: {
            backgroundColor: "#0b9444",
          },
          headerTintColor: "white",
        }}
      />
    </Stack>
  );
}
