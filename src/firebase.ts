import { initializeApp } from 'firebase/app';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDlly6oHzbWRk6ojWM7IOY20wKxhhB1DsE",
  authDomain: "peru-inka.firebaseapp.com",
  projectId: "peru-inka",
  storageBucket: "peru-inka.firebasestorage.app",
  messagingSenderId: "600487933880",
  appId: "1:600487933880:web:67c2d62d0e436c4199c14d"
};

export const app = initializeApp(firebaseConfig);

// Persistencia offline: las escrituras se encolan y sincronizan cuando hay conexión
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});
