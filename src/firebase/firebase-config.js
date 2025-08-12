import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA7KEbNBrbU4HgiblhRGksV2A47x9oMJr0",
  authDomain: "react-firebase-b0d3f.firebaseapp.com",
  projectId: "react-firebase-b0d3f",
  storageBucket: "react-firebase-b0d3f.firebasestorage.app",
  messagingSenderId: "742768421200",
  appId: "1:742768421200:web:75bb343c535940d8ee6455",
  measurementId: "G-CLB5WBHYYK"
};

// Initialize Firebase
initializeApp(firebaseConfig);
const auth = getAuth(); // Correct export
export {auth};