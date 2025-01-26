import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AuthScreen from './AuthScreen';

// Конфигурация Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB_tKKwxHxNbooHj99DqCFi0wJKex-yAR4",
  authDomain: "work-6694e.firebaseapp.com",
  projectId: "work-6694e",
  storageBucket: "work-6694e.firebasestorage.app",
  messagingSenderId: "657986177831",
  appId: "1:657986177831:web:cbbff75eab3e45898db702"
};


// Инициализация Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export default function App() {
  return (
    <View style={styles.container}>
      <AuthScreen auth={auth} firestore={firestore} /> {/* передаем auth и firestore */}
      <StatusBar style="auto" />
    </View>
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
