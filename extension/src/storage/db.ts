import { migrateV1RecordToV2, type ApplicationV1 } from "./migrations/v1-to-v2";

export const DB_NAME = "resume-tracker";
export const DB_VERSION = 2;
export const APPLICATIONS_STORE = "applications";
export const RESUMES_STORE = "resumes";
export const SETTINGS_STORE = "settings";

export function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = request.result;
      const tx = request.transaction;
      const oldVersion = event.oldVersion;

      if (!db.objectStoreNames.contains(APPLICATIONS_STORE)) {
        db.createObjectStore(APPLICATIONS_STORE, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(RESUMES_STORE)) {
        db.createObjectStore(RESUMES_STORE, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(SETTINGS_STORE)) {
        db.createObjectStore(SETTINGS_STORE, { keyPath: "id" });
      }

      if (oldVersion > 0 && oldVersion < 2 && tx) {
        const store = tx.objectStore(APPLICATIONS_STORE);
        const getAll = store.getAll();
        getAll.onsuccess = () => {
          for (const record of getAll.result as ApplicationV1[]) {
            store.put(migrateV1RecordToV2(record));
          }
        };
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(request.error ?? new Error("Failed to open IndexedDB"));
  });
}
