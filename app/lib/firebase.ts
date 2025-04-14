import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { firebaseConfig } from "../../firebase-config";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const database = getDatabase(app);

// Enable persistence for offline support (optional)
// firestore.enablePersistence().catch((err) => {
//   console.error("Error enabling Firestore persistence:", err)
// })

export default app;
