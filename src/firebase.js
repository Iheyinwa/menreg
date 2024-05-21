// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const apikey = import.meta.env.VITE_API_KEY

const firebaseConfig = {
  apiKey: apikey,
  authDomain: "agregistration-47ef1.firebaseapp.com",
  projectId: "agregistration-47ef1",
  storageBucket: "agregistration-47ef1.appspot.com",
  messagingSenderId: "901323374528",
  appId: "1:901323374528:web:a9c4cdc3aeece386d55225",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
