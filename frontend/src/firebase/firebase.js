// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBgm9EjYaghQXb3qzsNMYn5PlV06uXFc0I",
  authDomain: "ai-powered-scholarship-app.firebaseapp.com",
  projectId: "ai-powered-scholarship-app",
  storageBucket: "ai-powered-scholarship-app.firebasestorage.app",
  messagingSenderId: "704600095064",
  appId: "1:704600095064:web:c95af0266556911f81cd2d",
  measurementId: "G-K7KK0XM42P"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, app, firestore };