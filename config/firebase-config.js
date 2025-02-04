import admin from "firebase-admin";
import serviceAccount from "./serviceAccountKey.json" assert { type: "json" };

class FirebaseAdmin {
  constructor() {
    if (!FirebaseAdmin.instance) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
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
