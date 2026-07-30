import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC324_yg6_3QnmBfuAmOUue7sJ2NCFt2nE",
  authDomain: "authenticatemobile-8a081.firebaseapp.com",
  projectId: "authenticatemobile-8a081",
  storageBucket: "authenticatemobile-8a081.firebasestorage.app",
  messagingSenderId: "996847329207",
  appId: "1:996847329207:web:6d1a81aa2fc3917c541232",
  measurementId: "G-6C4NXMHR75",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
