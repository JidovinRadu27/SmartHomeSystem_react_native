import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBxBdKjv5Q5TGHmf1mFtLLj2Tcy8IsgPpk",
  authDomain: "aplicatie-fe272.firebaseapp.com",
  databaseURL: "https://aplicatie-fe272-default-rtdb.firebaseio.com",
  projectId: "aplicatie-fe272",
  storageBucket: "aplicatie-fe272.appspot.com",
  messagingSenderId: "89262338663",
  appId: "1:89262338663:web:2b2a9ec3c95130d7aedac2",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const auth = getAuth(app);

export { auth, database };
