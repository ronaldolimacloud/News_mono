import React from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

interface AppProps {
  Component?: React.ComponentType<any>;
  pageProps?: any;
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <h1>Hello {user?.username}</h1>
          <button onClick={signOut}>Sign out</button>
          {Component && <Component {...pageProps} />}
        </main>
      )}
    </Authenticator>
  );
} 