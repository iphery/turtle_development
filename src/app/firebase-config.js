import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBAAi7-2k4kVIQ8dbI4zmgaPjFvtwS85aI",
  authDomain: "turtle-dc989.firebaseapp.com",
  projectId: "turtle-dc989",
  storageBucket: "turtle-dc989.appspot.com",
  messagingSenderId: "949333866365",
  appId: "1:949333866365:web:29da129b7a47a00b5ebe14",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
