import { getApp, getApps, initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAO8HFi_QJhx3gbHyl81VFFSPpaMzwQ3bE",
  authDomain: "restoranapp-d0404.firebaseapp.com",
  databaseURL: "https://restoranapp-d0404-default-rtdb.firebaseio.com",
  projectId: "restoranapp-d0404",
  storageBucket: "restoranapp-d0404.appspot.com",
  messagingSenderId: "797804472919",
  appId: "1:797804472919:web:e8b55859a01281e2089112",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const firestore = getFirestore(app);
const storage = getStorage(app);

export { app, storage, firestore };
