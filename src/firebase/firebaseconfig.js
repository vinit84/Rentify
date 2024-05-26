import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";
import "firebase/compat/functions"; // Import Firebase Functions
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions"; // Import for Firebase Functions with Modular SDK
import { getDatabase } from "firebase/database";
import { getAuth } from "@firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBkxfHg_zRN98gQ4gihhbGFiB4Eh1m4oCo",
  authDomain: "rentify-ca0f4.firebaseapp.com",
  databaseURL: "https://rentify-ca0f4-default-rtdb.firebaseio.com",
  projectId: "rentify-ca0f4",
  storageBucket: "rentify-ca0f4.appspot.com",
  messagingSenderId: "960927607846",
  appId: "1:960927607846:web:6f43c3234dfc9cf04f4ae7",
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
export default firebase;

const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const db = getFirestore(app);
const storage = getStorage(app);
const functions = getFunctions(app); // Initialize Firebase Functions

const database = getDatabase(app);
const auth = getAuth(app);

export { db, storage, app, functions, database, auth };
