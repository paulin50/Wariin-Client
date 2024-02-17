// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage";
// import { getDatabase } from 'firebase/database'
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyALMQBn8pdg4JcQo0gNigPrGQ7sBD6HWYA",
//   authDomain: "wariin-mobile.firebaseapp.com",
//   projectId: "wariin-mobile",
//   storageBucket: "wariin-mobile.appspot.com",
//   messagingSenderId: "717131159466",
//   appId: "1:717131159466:web:0693b2514dfae5f690bdd3"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
// export const db = getFirestore(app);
// export const storage = getStorage(app);
// export const rdb = getDatabase(app);
// export const firestore = getFirestore(app);


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from 'firebase/database'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAZ1JmV2avUKopE_ZWf-xvUKpOMCH-I6CE",
  authDomain: "wariin.firebaseapp.com",
  projectId: "wariin",
  storageBucket: "wariin.appspot.com",
  messagingSenderId: "759678204789",
  appId: "1:759678204789:web:bb271ab4eb929651a8b13c",
  measurementId: "G-899GJXGK4D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth();
export const db = getFirestore(app);
export const storage = getStorage(app);
export const rdb = getDatabase(app);
export const firestore = getFirestore(app);