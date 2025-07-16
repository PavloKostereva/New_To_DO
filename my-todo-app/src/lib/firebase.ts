import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAEdM0tFJQ92wYVEeMSXFGn7m4TxBTC6Tk",
  authDomain: "todoapp-9ad3d.firebaseapp.com",
  projectId: "todoapp-9ad3d",
  storageBucket: "todoapp-9ad3d.firebasestorage.app",
  messagingSenderId: "613005467672",
  appId: "1:613005467672:web:b8ee33c77e9a31b0f9636d",
  measurementId: "G-G5KGR2J5RE"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);