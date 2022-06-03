// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
    getFirestore, collection, getDocs
} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCbMamMISViMpNtw4JXQGqn-J5VxUMyMKs",
  authDomain: "firstpage-f9dde.firebaseapp.com",
  projectId: "firstpage-f9dde",
  storageBucket: "firstpage-f9dde.appspot.com",
  messagingSenderId: "120347697336",
  appId: "1:120347697336:web:e96e3d451ea24e34b6d44d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// connect to the database
const db = getFirestore();
// reference to the main collection
const colUsers = collection(db, 'users');

getDocs(colUsers)
.then((snapshot) => {
    console.log(snapshot.docs)
});