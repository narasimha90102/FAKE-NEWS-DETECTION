import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCNNsUE9Oit22gI_6fGKdHIOdQV63kVt9M",
  authDomain: "truthguard-7fead.firebaseapp.com",
  projectId: "truthguard-7fead",
  storageBucket: "truthguard-7fead.firebasestorage.app",
  messagingSenderId: "32935267002",
  appId: "1:32935267002:web:117b95c7c2406fe5ca9083",
  measurementId: "G-JPE7TDP8E8"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);