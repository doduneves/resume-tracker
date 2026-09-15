import { SETTINGS_STORE } from "../db";

export const JOB_TITLES_SETTING_ID = "jobTitles";
export const STACK_TAGS_SETTING_ID = "stackTags";

export type SettingsId =
  | typeof JOB_TITLES_SETTING_ID
  | typeof STACK_TAGS_SETTING_ID;

export type SettingsRecord = {
  id: SettingsId;
  values: string[];
};

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

export class SettingsRepository {
  constructor(private readonly db: IDBDatabase) {}

  async list(id: SettingsId): Promise<string[]> {
    const tx = this.db.transaction(SETTINGS_STORE, "readonly");
    const done = transactionDone(tx);
    const store = tx.objectStore(SETTINGS_STORE);
    const row = (await requestToPromise(store.get(id))) as
      | SettingsRecord
      | undefined;
    await done;
    return row?.values ?? [];
  }

  async save(id: SettingsId, values: string[]): Promise<void> {
    const tx = this.db.transaction(SETTINGS_STORE, "readwrite");
    const done = transactionDone(tx);
    const store = tx.objectStore(SETTINGS_STORE);
    const record: SettingsRecord = { id, values };
    await requestToPromise(store.put(record));
    await done;
  }
}
