import generateData from "../src/components/atomic-crm/providers/fakerest/dataGenerator";
import type { Db } from "../src/components/atomic-crm/providers/fakerest/dataGenerator/types";

const DATABASE_NAME = "noxira-crm-guest-demo";
const DATABASE_VERSION = 1;
const OBJECT_STORE = "state";
const DATABASE_RECORD = "crm-data";
export const GUEST_DATA_SCHEMA_VERSION = 1;

type StoredGuestDatabase = {
  schemaVersion: number;
  data: Db;
  initialData: Db;
};

type FakeRestDatabase = {
  getCollectionNames(): string[];
  getAll(resource: string): unknown[];
};

type WindowWithFakeRestDatabase = Window & {
  _database?: FakeRestDatabase;
};

function openGuestDatabase(): Promise<IDBDatabase> {
  if (typeof indexedDB === "undefined") {
    return Promise.reject(
      new Error(
        "This browser does not provide IndexedDB, which the guest demo needs to save changes.",
      ),
    );
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(OBJECT_STORE)) {
        database.createObjectStore(OBJECT_STORE);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(
        request.error ??
          new Error("The browser could not open guest demo storage."),
      );
    request.onblocked = () =>
      reject(
        new Error(
          "Guest demo storage is busy in another tab. Close other Noxira CRM demo tabs and retry.",
        ),
      );
  });
}

function transactionComplete(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () =>
      reject(
        transaction.error ??
          new Error("The browser could not save guest demo changes."),
      );
    transaction.onabort = () =>
      reject(
        transaction.error ??
          new Error("The browser cancelled saving guest demo changes."),
      );
  });
}

async function readRecord(database: IDBDatabase): Promise<unknown> {
  const transaction = database.transaction(OBJECT_STORE, "readonly");
  const completed = transactionComplete(transaction);
  const request = transaction.objectStore(OBJECT_STORE).get(DATABASE_RECORD);
  const value = await new Promise<unknown>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(
        request.error ??
          new Error("The browser could not read saved guest demo data."),
      );
  });
  await completed;
  return value;
}

async function writeRecord(
  database: IDBDatabase,
  record: StoredGuestDatabase,
): Promise<void> {
  const transaction = database.transaction(OBJECT_STORE, "readwrite");
  const completed = transactionComplete(transaction);
  transaction.objectStore(OBJECT_STORE).put(record, DATABASE_RECORD);
  await completed;
}

function makeFictionalSampleDatabase(): Db {
  const database = generateData();

  database.sales = database.sales.map((sale, index) => ({
    ...sale,
    first_name: index === 0 ? "Noxira" : sale.first_name,
    last_name: index === 0 ? "Demo" : sale.last_name,
    email: `demo-rep-${index + 1}@example.test`,
    password: undefined,
    administrator: false,
  }));

  database.contacts = database.contacts.map((contact) => ({
    ...contact,
    email_jsonb: contact.email_jsonb.map((email, index) => ({
      ...email,
      email: `contact-${contact.id}-${index + 1}@example.test`,
    })),
    phone_jsonb: contact.phone_jsonb.map((phone, index) => ({
      ...phone,
      number: `+1 (202) 555-01${String((Number(contact.id) * 2 + index) % 100).padStart(2, "0")}`,
    })),
  }));

  database.companies = database.companies.map((company) => ({
    ...company,
    website: `https://company-${Number(company.id) + 1}.example.test`,
  }));

  return database;
}

function isDbShape(value: unknown): value is Db {
  if (typeof value !== "object" || value === null) return false;

  return [
    "companies",
    "contacts",
    "contact_notes",
    "deals",
    "deal_notes",
    "sales",
    "tags",
    "tasks",
    "configuration",
  ].every((resource) =>
    Array.isArray((value as Record<string, unknown>)[resource]),
  );
}

function readStoredDatabase(value: unknown): StoredGuestDatabase {
  if (
    typeof value !== "object" ||
    value === null ||
    !("schemaVersion" in value) ||
    !("data" in value)
  ) {
    throw new Error(
      "Saved guest demo data could not be read. It has been left untouched; use Reset Demo Data to create a fresh sample.",
    );
  }

  const stored = value as StoredGuestDatabase;
  if (stored.schemaVersion !== GUEST_DATA_SCHEMA_VERSION) {
    throw new Error(
      `Saved guest demo data uses version ${stored.schemaVersion}, but this app supports version ${GUEST_DATA_SCHEMA_VERSION}. Your data was left untouched; use Reset Demo Data to start fresh.`,
    );
  }
  if (!isDbShape(stored.data) || !isDbShape(stored.initialData)) {
    throw new Error(
      "Saved guest demo data is incomplete and has been left untouched. Use Reset Demo Data to create a fresh sample.",
    );
  }

  return stored;
}

export async function loadOrSeedGuestDatabase(): Promise<Db> {
  const database = await openGuestDatabase();
  try {
    const stored = await readRecord(database);
    if (stored !== undefined) {
      return readStoredDatabase(stored).data;
    }

    const initialData = makeFictionalSampleDatabase();
    await writeRecord(database, {
      schemaVersion: GUEST_DATA_SCHEMA_VERSION,
      data: initialData,
      initialData: JSON.parse(JSON.stringify(initialData)) as Db,
    });
    return initialData;
  } finally {
    database.close();
  }
}

export async function saveGuestDatabase(data: Db): Promise<void> {
  const database = await openGuestDatabase();
  try {
    const stored = readStoredDatabase(await readRecord(database));
    await writeRecord(database, {
      ...stored,
      data,
    });
  } finally {
    database.close();
  }
}

export function getCurrentGuestDatabaseSnapshot(): Db {
  const database = (window as WindowWithFakeRestDatabase)._database;
  if (!database) {
    throw new Error(
      "The guest CRM data provider is not ready, so this change could not be saved.",
    );
  }

  const snapshot = Object.fromEntries(
    database
      .getCollectionNames()
      .map((resource) => [resource, database.getAll(resource)]),
  );

  if (!isDbShape(snapshot)) {
    throw new Error(
      "The guest CRM data provider returned incomplete records, so this change could not be saved.",
    );
  }

  return snapshot;
}

export async function resetGuestDatabase(): Promise<void> {
  const database = await openGuestDatabase();
  try {
    const value = await readRecord(database);
    if (value === undefined) return;

    let stored: StoredGuestDatabase;
    try {
      stored = readStoredDatabase(value);
    } catch {
      const transaction = database.transaction(OBJECT_STORE, "readwrite");
      const completed = transactionComplete(transaction);
      transaction.objectStore(OBJECT_STORE).delete(DATABASE_RECORD);
      await completed;
      return;
    }

    await writeRecord(database, {
      ...stored,
      data: JSON.parse(JSON.stringify(stored.initialData)) as Db,
    });
  } finally {
    database.close();
  }
}

export const guestDemoSessionKey = "noxira-crm-demo-entered";
