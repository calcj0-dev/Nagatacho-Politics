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
const db = firebase.firestore();

// ============================================================
// プロフィール
// ============================================================

function generatePlayerName() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let name = "";
  for (let i = 0; i < 12; i++) {
    name += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return name;
}

async function saveProfile(uid, name) {
  await db.collection("users").doc(uid).set({ name }, { merge: true });
}

async function loadProfile(uid) {
  const doc = await db.collection("users").doc(uid).get();
  return doc.exists ? doc.data() : null;
}

async function saveResult(uid, isWin, isDraw) {
  const ref = db.collection("users").doc(uid);
  const doc = await ref.get();
  const data = doc.exists ? doc.data() : {};
  const newStreak = isWin ? (data.streak || 0) + 1 : 0;
  const update = {
    wins:      (data.wins   || 0) + (isWin             ? 1 : 0),
    losses:    (data.losses || 0) + (!isWin && !isDraw ? 1 : 0),
    streak:    newStreak,
    maxStreak: Math.max(data.maxStreak || 0, newStreak),
  };
  await ref.set(update, { merge: true });
  return update;
}

async function loadRanking() {
  const snapshot = await db.collection("users")
    .orderBy("maxStreak", "desc")
    .limit(20)
    .get();
  return snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
}

function signInWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  return auth.signInWithPopup(provider).catch(err => {
    // ポップアップがブロックされた場合はリダイレクトにフォールバック
    if (err.code === "auth/popup-blocked" || err.code === "auth/popup-closed-by-user") {
      return auth.signInWithRedirect(provider);
    }
    throw err;
  });
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
