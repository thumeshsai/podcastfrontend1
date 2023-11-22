/* eslint-disable no-unused-vars */
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
 
const firebaseConfig = {
  apiKey: "AIzaSyCdCKsfbnDWLSJ45CJtYfL7nswJv47kwrE",
  authDomain: "podcast-9dd9f.firebaseapp.com",
  projectId: "podcast-9dd9f",
  storageBucket: "podcast-9dd9f.appspot.com",
  messagingSenderId: "875512202842",
  appId: "1:875512202842:web:9d0750b071b5f16fa8ba63",
  measurementId: "G-HGYN5RC98N",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
