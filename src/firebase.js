import firebase from "firebase/compat/app";
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

const firebaseConfig = {
    apiKey: 'AIzaSyD2GcWQbXs5mV_SJtN1Zx_6ATx0BsSJEtw',
    authDomain: "pedalboxd.firebaseapp.com",
    projectId: 'pedalboxd'
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();

export { db, auth, firebase };