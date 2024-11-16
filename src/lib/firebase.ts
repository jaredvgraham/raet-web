import admin from "firebase-admin";

const serviceAccount = JSON.parse(process.env.FIREBASE_KEY!);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount!),
  databaseURL: "https://raet-af52c-default-rtdb.firebaseio.com",
});
export const db = admin.database();
