import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDlly6oHzbWRk6ojWM7IOY20wKxhhB1DsE",
  authDomain: "peru-inka.firebaseapp.com",
  projectId: "peru-inka",
  storageBucket: "peru-inka.firebasestorage.app",
  messagingSenderId: "600487933880",
  appId: "1:600487933880:web:67c2d62d0e436c4199c14d"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
