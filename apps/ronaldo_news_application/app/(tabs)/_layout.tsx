import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';


export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#0b9444', tabBarInactiveTintColor: '#5d7768' }}>
      <Tabs.Screen
        name="index"
        options={{
          headerShown: true,
          title: 'Home',
          headerStyle: {
            backgroundColor: "#0b9444",
          },
          headerTintColor: "white",
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="App_news"
        options={{
          headerShown: false,
          title: 'News',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="newspaper-o" color={color} />,
        }}
      />
      <Tabs.Screen
        name="dynamo"
        options={{
          headerShown: true,
          title: 'dynamo',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="newspaper-o" color={color} />,
        }}
      />
    </Tabs>
  );
}
