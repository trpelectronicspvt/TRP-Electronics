// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  deleteDoc, 
  updateDoc 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAiIZhuz_7GmbDyO1C2zT2uGop0iEuk6Hg",
  authDomain: "trp-electronics.firebaseapp.com",
  projectId: "trp-electronics",
  storageBucket: "trp-electronics.firebasestorage.app",
  messagingSenderId: "242376796817",
  appId: "1:242376796817:web:b94568352b5569cae72d30",
  measurementId: "G-W5P2VHPCLC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// ✅ Sabhi functions ko export karein taaki components.html aur admin.html dono inhe use kar sakein
export { 
  db, 
  auth, 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  deleteDoc, 
  updateDoc, 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut 
};
