import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AuthScreen from './AuthScreen';
import ChatScreen from './ChatScreen';

const firebaseConfig = {
  apiKey: "AIzaSyB_tKKwxHxNbooHj99DqCFi0wJKex-yAR4",
  authDomain: "work-6694e.firebaseapp.com",
  projectId: "work-6694e",
  storageBucket: "work-6694e.firebasestorage.app",
  messagingSenderId: "657986177831",
  appId: "1:657986177831:web:cbbff75eab3e45898db702",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Auth">
        <Stack.Screen name="Auth">
          {(props) => <AuthScreen {...props} auth={auth} firestore={firestore} />}
        </Stack.Screen>
        <Stack.Screen name="Chat">
          {(props) => <ChatScreen {...props} auth={auth} firestore={firestore} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
