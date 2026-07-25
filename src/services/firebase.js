import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile,
  onAuthStateChanged 
} from "firebase/auth";

/* Demo / Standard Firebase Configuration placeholder */
const firebaseConfig = {
  apiKey: "AIzaSyDemoTruthGuardKeyForFirebaseAuthentication12345",
  authDomain: "truthguard-demo.firebaseapp.com",
  projectId: "truthguard-demo",
  storageBucket: "truthguard-demo.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:demo123456789012"
};

/* Initialize Firebase App & Auth with safety fallback */
let app;
let auth;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
} catch (e) {
  console.warn("Firebase Auth initializing in offline fallback mode:", e);
}

export { 
  auth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile, 
  onAuthStateChanged 
};
