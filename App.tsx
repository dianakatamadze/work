import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AuthScreen from './AuthScreen';
import WelcomeScreen from './WelcomeScreen';

// Конфигурация Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB_tKKwxHxNbooHj99DqCFi0wJKex-yAR4",
  authDomain: "work-6694e.firebaseapp.com",
  projectId: "work-6694e",
  storageBucket: "work-6694e.firebasestorage.app",
  messagingSenderId: "657986177831",
  appId: "1:657986177831:web:cbbff75eab3e45898db702",
};

// Инициализация Firebase
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
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
