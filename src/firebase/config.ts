// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDuSAGcBie83lf8-2V3-WNxsGSqjbylVT0",
  authDomain: "gunluk-rutinler.firebaseapp.com",
  projectId: "gunluk-rutinler",
  storageBucket: "gunluk-rutinler.firebasestorage.app",
  messagingSenderId: "667660361924",
  appId: "1:667660361924:web:8965b6cb6833b6a63c2991",
  measurementId: "G-5089QMTPEK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase servislerini dışa aktar
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

export default app;