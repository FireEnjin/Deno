import { initializeApp } from "https://cdn.skypack.dev/@firebase/app";
import {
  getFirestore,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query as firestoreQuery,
  orderBy as firestoreOrderBy,
  limit as firestoreLimit,
  where as firestoreWhere,
  setDoc,
  updateDoc,
  onSnapshot,
  enableIndexedDbPersistence,
  connectFirestoreEmulator,
} from "https://cdn.skypack.dev/@firebase/firestore";
import {
  connectFunctionsEmulator,
  getFunctions,
  httpsCallable,
} from "https://cdn.skypack.dev/@firebase/functions";

export default class Database {
  app: any;
  service: any;
  watchers: any = {};
  functions: any;

  constructor(options?: { emulate?: boolean; app?: any; config?: any }) {
    this.app = options?.app || null;
    if (!this.app && window) {
      try {
        this.app = initializeApp(options?.config);
        console.log("Initializing Firebase App...");
      } catch (e) {
        console.log(e);
      }
    }
    this.service = getFirestore(this.app);
    this.functions = getFunctions(this.app);
    if (options?.emulate) {
      connectFirestoreEmulator(this.service, "localhost", 8080);
      connectFunctionsEmulator(this.functions, "localhost", 5001);
    }
  }

  call(functionName: string) {
    return httpsCallable(this.functions, functionName);
  }

  async add(collectionName: string, data: any, id?: string) {
    const collection = await this.collection(collectionName);

    if (id) {
      await setDoc(this.document(collectionName, id), data);
    }
    return id ? this.document(collectionName, id) : addDoc(collection, data);
  }

  async delete(path: string, id?: string) {
    const doc = this.document(path, id);
    await deleteDoc(doc);

    return { id: doc.id };
  }

  async find(collectionName: string, id: string) {
    const doc = await this.getDocument(collectionName, id);
    return doc.data();
  }

  collection(path: string) {
    return collection(this.service, path);
  }

  getCollection(path: string) {
    return getDocs(this.collection(path));
  }

  document(path: string, id?: string) {
    return id ? doc(this.collection(path), id) : doc(this.service, path);
  }

  getDocument(path: string, id?: string) {
    return getDoc(this.document(path, id));
  }

  async update(collectionName: string, id: string, data: any) {
    const document = this.document(collectionName, id);
    await updateDoc(document, data, { merge: true });
    const newDocument = await this.getDocument(collectionName, id);

    return newDocument.data();
  }

  async clearWatchers() {
    for (const watcherKey of Object.keys(this.watchers)) {
      this.watchers[watcherKey]();
    }

    return true;
  }

  subscribe(
    query: {
      collectionName: string;
      where?: { key?: string; conditional?: any; value?: any }[];
      orderBy?: string;
      limit?: number;
    },
    callback: (data: { docs: any[] }) => void,
    name?: string
  ) {
    const watcherName = name ? name : new Date().toISOString();
    this.watchers[watcherName] = onSnapshot(
      this.rawQuery(
        query?.collectionName,
        query?.where,
        query?.orderBy,
        query?.limit
      ),
      async (snapshot: any) => {
        if (callback && typeof callback === "function") {
          callback({ docs: snapshot?.docs || [] });
        }
      }
    );

    return this.watchers[watcherName];
  }

  unsubscribe(watcherName: string) {
    if (
      this.watchers[watcherName] &&
      typeof this.watchers[watcherName] === "function"
    ) {
      this.watchers[watcherName]();

      return true;
    } else {
      console.log(`There is no watcher running on ${watcherName} query.`);

      return false;
    }
  }

  watchDocument(
    collectionName: string,
    id: string,
    callback: (res: { data: any }) => void
  ) {
    const watcherName = `${collectionName}:${id}`;
    this.watchers[watcherName] = onSnapshot(
      this.document(collectionName, id),
      async (doc: any) => {
        if (callback && typeof callback === "function") {
          callback({ data: doc.data() });
        }
      }
    );
  }

  unwatchDocument(collectionName: string, id: string) {
    const watcherName = `${collectionName}:${id}`;
    if (
      this.watchers[watcherName] &&
      typeof this.watchers[watcherName] === "function"
    ) {
      this.watchers[watcherName]();

      return true;
    } else {
      console.log(`There is no watcher running on ${watcherName} document.`);

      return false;
    }
  }

  rawQuery(
    collectionName: string,
    where?: { key?: string; conditional?: any; value?: any }[],
    orderBy?: string,
    limit?: number
  ) {
    const params: any = [];
    for (const w of where || []) {
      if (!w?.conditional || !w?.key) continue;
      params.push(firestoreWhere(w.key, w.conditional, w.value));
    }
    if (orderBy) params.push(firestoreOrderBy(orderBy));
    if (limit) params.push(firestoreLimit(limit));

    return firestoreQuery(this.collection(collectionName), ...params);
  }

  async query(
    collectionName: string,
    where: { key?: string; conditional?: any; value?: any }[],
    orderBy?: string,
    limit?: number
  ) {
    return getDocs(this.rawQuery(collectionName, where, orderBy, limit));
  }

  async list(
    collectionName: string,
    where: { key?: string; conditional?: any; value?: any }[],
    orderBy?: string,
    limit?: number
  ) {
    const query = await this.query(collectionName, where, orderBy, limit);

    return (
      query?.docs?.map((queryDoc) => ({
        id: queryDoc.id,
        ...(queryDoc?.exists() ? queryDoc.data() : {}),
      })) || null
    );
  }

  async getApp() {
    return this.app;
  }

  async getService() {
    return this.service;
  }
}
