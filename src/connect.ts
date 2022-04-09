import { initializeApp } from "https://cdn.skypack.dev/@firebase/app";
import { getFirestore } from "https://cdn.skypack.dev/@firebase/firestore";

export default async function connect(options?: {
  app?: any;
  config?: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };
}) {
  let app = null;
  try {
    app = options?.app || initializeApp(options?.config);
    console.log("Initializing Firebase App...");
  } catch (e) {
    console.log(e);
  }
  const firestore = getFirestore(app);

  return firestore;
}
