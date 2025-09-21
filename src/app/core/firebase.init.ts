import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCGQ7HGKSFzPx5jyE0hGDIetIX14B5wzJo",
  authDomain: "mywallpaper-c380d.firebaseapp.com",
  projectId: "mywallpaper-c380d",
  storageBucket: "mywallpaper-c380d.appspot.com",
  messagingSenderId: "132370081062",
  appId: "1:132370081062:web:6c952b088520653d900de7",
  measurementId: "G-GEQ3Q43L3X"
};

const app = initializeApp(firebaseConfig);

export const firebaseAuth = getAuth(app);
export const firebaseDb = getFirestore(app);
export const firebaseStorage = getStorage(app);