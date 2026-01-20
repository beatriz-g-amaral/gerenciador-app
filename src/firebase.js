import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use

const firebaseConfig = {
  apiKey: "AIzaSyDwqkwolOEDtmvUn9P3w-he4K3Vz9WKgb4",
  authDomain: "gerenciador-15f1c.firebaseapp.com",
  projectId: "gerenciador-15f1c",
  storageBucket: "gerenciador-15f1c.firebasestorage.app",
  messagingSenderId: "25006794530",
  appId: "1:25006794530:web:a5af5a593fad5a71b4677b",
  measurementId: "G-XSKW75JCLN"
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
