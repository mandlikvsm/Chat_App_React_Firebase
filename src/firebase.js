// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAUXP1vqD8ADvQz-E1DCUXQi6Lx2W9z5XA",
  authDomain: "charapp-m-vishal.firebaseapp.com",
  projectId: "charapp-m-vishal",
  storageBucket: "charapp-m-vishal.appspot.com",
  messagingSenderId: "41651598534",
  appId: "1:41651598534:web:d2aa3cab638fff87f253c7",
  measurementId: "G-DYPNVR7PK4"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);