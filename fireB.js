import * as firebase from "firebase";
import 'firebase/auth';
import 'firebase/firestore';


var firebaseConfig = {
  apiKey: "AIzaSyDn5t1QktJM8DdsGYIsv_IzZ03zfwphkEI",
  authDomain: "horse-club-app.firebaseapp.com",
  projectId: "horse-club-app",
  storageBucket: "horse-club-app.appspot.com",
  messagingSenderId: "218022742499",
  appId: "1:218022742499:web:b12eda9d0d5e7cfd3478d6"
};

let app;
if (firebase.apps.length === 0) {
app = firebase.initializeApp(firebaseConfig);
} else {
app = firebase.app();
}

const db = app.firestore();
const auth = firebase.auth();

export { db, auth };

