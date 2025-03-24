


import React from "react";
import { Button, View, StyleSheet } from "react-native";


import { Amplify } from "aws-amplify";
import { useAuthenticator } from "@aws-amplify/ui-react-native";


const SignOutButton = () => {
  const { signOut } = useAuthenticator();

  return (
    <View style={styles.signOutButton}>
      <Button title="Sign Out" onPress={signOut} />
    </View>
  );
};

export default function HomeScreen() {
  const { user } = useAuthenticator();

  return (
    <View style={styles.container}>
      <SignOutButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    
  },
  signOutButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});     
