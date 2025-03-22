import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.ts'
import { Amplify } from 'aws-amplify'
import '@aws-amplify/ui-react/styles.css'
// In Amplify v6, imports are more modular:
import { getCurrentUser, signOut, signIn } from 'aws-amplify/auth'
// For vanilla JS/TS with React components
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Authenticator } from '@aws-amplify/ui-react'

// Import your Amplify configuration
// You'll need to adjust the path to your amplify_outputs.json
import outputs from '../../../amplify_outputs.json'

// Configure Amplify
Amplify.configure(outputs)

// Get the app container
const app = document.querySelector<HTMLDivElement>('#app')!

// Create a React root for the app container
const root = ReactDOM.createRoot(app)

// Create the authentication component using React.createElement
// Note: Since we can't use JSX in a .ts file, we use React.createElement
const AuthApp = () => {
  return React.createElement(
    Authenticator,
    {},
    ({ signOut, user }: any) => {
      return React.createElement('div', {}, [
        React.createElement('a', { href: 'https://vite.dev', target: '_blank' }, [
          React.createElement('img', { src: viteLogo, className: 'logo', alt: 'Vite logo' })
        ]),
        React.createElement('a', { href: 'https://www.typescriptlang.org/', target: '_blank' }, [
          React.createElement('img', { src: typescriptLogo, className: 'logo vanilla', alt: 'TypeScript logo' })
        ]),
        React.createElement('h1', {}, 'Vite + TypeScript'),
        React.createElement('h2', {}, `Hello ${user?.username || 'User'}`),
        React.createElement('button', { onClick: signOut }, 'Sign out'),
        React.createElement('div', { className: 'card' }, [
          React.createElement('button', { id: 'counter', type: 'button' })
        ]),
        React.createElement('p', { className: 'read-the-docs' }, 
          'Click on the Vite and TypeScript logos to learn more'
        )
      ]);
    }
  );
};

// Render the authentication app
root.render(React.createElement(AuthApp));

// Set up counter once the DOM is fully loaded
setTimeout(() => {
  const counterButton = document.querySelector<HTMLButtonElement>('#counter')
  if (counterButton) {
    setupCounter(counterButton)
  }
}, 100)
