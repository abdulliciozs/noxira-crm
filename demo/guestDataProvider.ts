import type { AuthProvider } from "ra-core";
import type { CrmDataProvider } from "../src/components/atomic-crm/providers/types";
import { createDataProvider } from "../src/components/atomic-crm/providers/fakerest/dataProvider";
import type { Db } from "../src/components/atomic-crm/providers/fakerest/dataGenerator/types";
import {
  getCurrentFakeRestDatabase,
  getCurrentGuestDatabaseSnapshot,
  saveGuestDatabase,
} from "./guestDatabase";

const MUTATING_METHODS = new Set([
  "create",
  "update",
  "updateMany",
  "delete",
  "deleteMany",
  "unarchiveDeal",
  "signUp",
  "salesCreate",
  "salesUpdate",
  "mergeContacts",
  "updateConfiguration",
]);

export function createGuestDataProvider(
  initialDatabase: Db,
  onSaveError: (error: unknown) => void,
  onSaveSuccess: () => void,
): CrmDataProvider {
  const provider = createDataProvider({
    db: initialDatabase,
    latency: 0,
    silent: true,
    authProvider: {
      getIdentity: async () => ({
        id: 0,
        fullName: "Noxira Demo",
      }),
    },
  });
  // ra-data-fakerest exposes its internal database as window._database. Capture
  // this provider's instance now: responsive Admin remounts and StrictMode can
  // overwrite that global with a different provider's database later.
  const database = getCurrentFakeRestDatabase();

  let saveQueue = Promise.resolve();

  const saveCurrentState = () => {
    const save = saveQueue
      .catch(() => undefined)
      .then(() => saveGuestDatabase(getCurrentGuestDatabaseSnapshot(database)));
    saveQueue = save;
    return save;
  };

  return new Proxy(provider, {
    get(target, property, receiver) {
      if (property === "updatePassword") {
        return async () => {
          throw new Error(
            "Password changes require a real account and are unavailable in this browser-only guest demo.",
          );
        };
      }

      const method = Reflect.get(target, property, receiver);
      if (
        typeof property !== "string" ||
        !MUTATING_METHODS.has(property) ||
        typeof method !== "function"
      ) {
        return method;
      }

      return async (...args: unknown[]) => {
        const result = await Reflect.apply(method, target, args);
        try {
          await saveCurrentState();
          onSaveSuccess();
        } catch (error) {
          onSaveError(error);
          throw error;
        }
        return result;
      };
    },
  });
}

export function createGuestAuthProvider(
  dataProvider: CrmDataProvider,
): AuthProvider {
  return {
    login: async () => {
      throw new Error(
        "Account sign-in is unavailable in the browser-only guest demo.",
      );
    },
    logout: async () => {
      try {
        window.sessionStorage.removeItem("noxira-crm-demo-entered");
      } finally {
        window.location.assign("/");
      }
    },
    checkError: async () => undefined,
    checkAuth: async () => undefined,
    canAccess: async ({ resource }) =>
      resource !== "sales" && resource !== "configuration",
    getIdentity: async () => {
      const { data: user } = await dataProvider.getOne("sales", { id: 0 });
      return {
        id: user.id,
        fullName: user.first_name + " " + user.last_name,
        avatar: user.avatar?.src,
      };
    },
    resetPassword: async () => {
      throw new Error(
        "Password reset email is unavailable in the browser-only guest demo.",
      );
    },
    setPassword: async () => {
      throw new Error(
        "Password changes require real account authentication and are unavailable in this guest demo.",
      );
    },
  };
}
