// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyDTzdrtXj39FN0y0YrZZgGn9l3PiawuNQQ",
  authDomain: "summarist-book-app.firebaseapp.com",
  projectId: "summarist-book-app",
  storageBucket: "summarist-book-app.firebasestorage.app",
  messagingSenderId: "602157475276",
  appId: "1:602157475276:web:086e9da5189811fe2ea969"
};

// Initialize firebase for client-side use
// function initializeFirebaseApp() {
//   if (!getApps().length) {
//     return initializeApp(firebaseConfig)
//   } else {
//     return getApp();
//   }
// }

// const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
