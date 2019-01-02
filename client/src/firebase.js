import firebase from 'firebase';

// Initialize Firebase
const config = {
    apiKey: "AIzaSyBC2_c3t9AArYzbDbvBfFRBc5p0CkM0xqk",
    authDomain: "recipe-book-4509.firebaseapp.com",
    databaseURL: "https://recipe-book-4509.firebaseio.com",
    projectId: "recipe-book-4509",
    storageBucket: "recipe-book-4509.appspot.com",
    messagingSenderId: "221347556023"
};

firebase.initializeApp(config);
export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export default firebase;