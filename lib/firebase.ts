import { initializeApp, getApps } from "firebase/app"
import { getDatabase } from "firebase/database"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyDTzvDrmYaKvOazPUIzXpBnHJG-vi2H1XY",
  authDomain: "mehran-menu.firebaseapp.com",
  databaseURL: "https://mehran-menu-default-rtdb.firebaseio.com",
  projectId: "mehran-menu",
  storageBucket: "mehran-menu.firebasestorage.app",
  messagingSenderId: "464309085334",
  appId: "1:464309085334:web:60d90587bcf5144b11ceb7",
  measurementId: "G-83EC2XE5P9",
}

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
export const database = getDatabase(app)
export const auth = getAuth(app)
export default app
