// Import Firebase
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Replace with your own Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyDt2c6ufRqXEvARi8xnYLEUb7PaDcq3vus",
    authDomain: "tigerprivacy-3c8b1.firebaseapp.com",
    projectId: "tigerprivacy-3c8b1",
    storageBucket: "tigerprivacy-3c8b1.firebasestorage.app",
    messagingSenderId: "523663820671",
    appId: "1:523663820671:web:f8454141bce3f054693c4a",
    measurementId: "G-1GLX59E387"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
