import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyANhgZF1wAAD24-JDZ780RDRs0i_0-sPz0',
  authDomain: 'customerapp-f50ff.firebaseapp.com',
  projectId: 'customerapp-f50ff',
  storageBucket: 'customerapp-f50ff.appspot.com',
  messagingSenderId: '681143401691',
  appId: '1:681143401691:web:10c411cde54e9c912c60fe',
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };