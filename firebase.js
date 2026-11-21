
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCvll8S872JpAjdBVuUc2NiHZo0VMkZAEU",
  authDomain: "low-mart-db7a0.firebaseapp.com",
  projectId: "low-mart-db7a0",
  storageBucket: "low-mart-db7a0.firebasestorage.app",
  messagingSenderId: "899818302128",
  appId: "1:899818302128:web:5eb99fa4bfac6a73b12975",
  measurementId: "G-4E2YF69BK0"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
