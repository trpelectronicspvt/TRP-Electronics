// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAiIZhuz_7GmbDyO1C2zT2uGop0iEuk6Hg",
  authDomain: "trp-electronics.firebaseapp.com",
  projectId: "trp-electronics",
  storageBucket: "trp-electronics.firebasestorage.app",
  messagingSenderId: "242376796817",
  appId: "1:242376796817:web:b94568352b5569cae72d30",
  measurementId: "G-W5P2VHPCLC"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
