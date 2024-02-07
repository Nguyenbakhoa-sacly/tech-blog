

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCXVvWK2rr39MIorshBcKiMTEycNY4t6j0",
  authDomain: "tech-blog-da0ae.firebaseapp.com",
  projectId: "tech-blog-da0ae",
  storageBucket: "tech-blog-da0ae.appspot.com",
  messagingSenderId: "217338518476",
  appId: "1:217338518476:web:8e25b49fb1ed3900fbdb69",
  measurementId: "G-9K797FYQZ9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;