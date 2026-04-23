// ============================================================
// Firebase Authentication
// ============================================================

const firebaseConfig = {
  apiKey: "AIzaSyAqv3Vx3WxFU2hBoR8n0iGyJRzRX4e2-lE",
  authDomain: "nagatacho-politics.firebaseapp.com",
  projectId: "nagatacho-politics",
  storageBucket: "nagatacho-politics.firebasestorage.app",
  messagingSenderId: "802443456098",
  appId: "1:802443456098:web:2ebee20a52abbccf81eb3b",
  measurementId: "G-FSDG4DZ7Z0"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

function signInWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  return auth.signInWithRedirect(provider);
}

function signOutUser() {
  return auth.signOut();
}

function getCurrentUser() {
  return auth.currentUser;
}

function onAuthStateChanged(callback) {
  return auth.onAuthStateChanged(callback);
}
