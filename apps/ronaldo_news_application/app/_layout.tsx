import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { useRouter, useSegments, Slot } from "expo-router";
import outputs from "./../amplify_outputs.json";

import { Amplify } from "aws-amplify";
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react-native";

// Import our config that uses environment variables


// Configure Amplify with the outputs
Amplify.configure(outputs);
// Authentication protection wrapper
function AuthWrapper() {
  const segments = useSegments();
  const router = useRouter();
  const { authStatus } = useAuthenticator(context => [context.authStatus]);
  
  useEffect(() => {
    // Check if user is authenticated or not
    if (authStatus === 'configuring') return;

    const isAuthRoute = segments[0] === '(tabs)';

    if (authStatus !== 'authenticated' && !isAuthRoute) {
      // Redirect to the auth screen if not authenticated
      router.replace('/(tabs)');
    } else if (authStatus === 'authenticated' && isAuthRoute) {
      // User is already authenticated and on the auth route
      // Stay on tabs - no redirection needed
    }
  }, [authStatus, segments, router]);

  return <Slot />;
}

export default function RootLayout() {
  return (
    <Authenticator.Provider>
      {/* Using default Authenticator with no customization for now to fix errors */}
      <Authenticator>
        <AuthWrapper />
      </Authenticator>
    </Authenticator.Provider>
  );
}

const styles = StyleSheet.create({
  signOutButton: {
    alignSelf: "flex-end",
  }
});