// create and initialize your own firebase here
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAVEZAliZ4wVjy0YgMso-4U00mfuIFlb2s",
    authDomain: "photofolio-aba3c.firebaseapp.com",
    projectId: "photofolio-aba3c",
    storageBucket: "photofolio-aba3c.appspot.com",
    messagingSenderId: "894333896728",
    appId: "1:894333896728:web:bbf1c1daa4171aca8e9b6d"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
