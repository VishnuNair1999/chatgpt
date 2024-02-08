import { getFirestore } from "firebase/firestore";
import { getApp, getApps, initializeApp } from "firebase/app";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCoeORrXDELdaux_JELA-sUFeoQ19eAU8U",
  authDomain: "chatgpt-messenger-f0017.firebaseapp.com",
  projectId: "chatgpt-messenger-f0017",
  storageBucket: "chatgpt-messenger-f0017.appspot.com",
  messagingSenderId: "61918611919",
  appId: "1:61918611919:web:09a681b72d3ebabb1f6aba"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app)

export {db}