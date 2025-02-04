// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id",
  measurementId: "your-measurement-id",
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);

const firebaseAuth = firebase.auth();
firebaseAuth.setPersistence(firebase.auth.Auth.Persistence.NONE);

export { firebaseAuth, firebaseApp };
