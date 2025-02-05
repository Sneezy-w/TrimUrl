import admin from "firebase-admin";

class FirebaseAdmin {
  constructor() {
    if (!FirebaseAdmin.instance) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        }),
      });
      FirebaseAdmin.instance = admin;
    }
    return FirebaseAdmin.instance;
  }

  static getInstance() {
    return new FirebaseAdmin();
  }
}

export default FirebaseAdmin.getInstance();
