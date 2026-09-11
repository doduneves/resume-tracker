import type { Application } from "../../domain/application";
import { APPLICATIONS_STORE } from "../db";

function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(request.error ?? new Error("IndexedDB request failed"));
  });
}

function transactionDone(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () =>
      reject(tx.error ?? new Error("IndexedDB transaction failed"));
    tx.onabort = () =>
      reject(tx.error ?? new Error("IndexedDB transaction aborted"));
  });
}

export class ApplicationRepository {
  constructor(private readonly db: IDBDatabase) {}

  async list(): Promise<Application[]> {
    const tx = this.db.transaction(APPLICATIONS_STORE, "readonly");
    const done = transactionDone(tx);
    const store = tx.objectStore(APPLICATIONS_STORE);
    const rows = await requestToPromise(store.getAll());
    await done;
    return rows as Application[];
  }

  async getById(id: string): Promise<Application | undefined> {
    const tx = this.db.transaction(APPLICATIONS_STORE, "readonly");
    const done = transactionDone(tx);
    const store = tx.objectStore(APPLICATIONS_STORE);
    const row = await requestToPromise(store.get(id));
    await done;
    return row as Application | undefined;
  }

  async create(application: Application): Promise<Application> {
    const tx = this.db.transaction(APPLICATIONS_STORE, "readwrite");
    const done = transactionDone(tx);
    const store = tx.objectStore(APPLICATIONS_STORE);
    await requestToPromise(store.add(application));
    await done;
    return application;
  }

  async update(application: Application): Promise<Application> {
    const tx = this.db.transaction(APPLICATIONS_STORE, "readwrite");
    const done = transactionDone(tx);
    const store = tx.objectStore(APPLICATIONS_STORE);
    await requestToPromise(store.put(application));
    await done;
    return application;
  }

  async delete(id: string): Promise<void> {
    const tx = this.db.transaction(APPLICATIONS_STORE, "readwrite");
    const done = transactionDone(tx);
    const store = tx.objectStore(APPLICATIONS_STORE);
    await requestToPromise(store.delete(id));
    await done;
  }
}
