import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA0QE-Es1Se9yNsyHosCrzZcloxsoyXibE",
  authDomain: "whale-talk-d2489.firebaseapp.com",
  projectId: "whale-talk-d2489",
  storageBucket: "whale-talk-d2489.appspot.com",
  messagingSenderId: "113609117061",
  appId: "1:113609117061:web:dfda9314ec9d23d84b08ec",
  measurementId: "G-HN7SRD9Q2G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
