import { createContext, useContext, useState } from "react";
import { memoryStore, type LayoutComponent } from "ra-core";
import { Button } from "@/components/ui/button";
import { CRM } from "@/components/atomic-crm/root/CRM";
import { Layout } from "@/components/atomic-crm/layout/Layout";
import type { Db } from "../src/components/atomic-crm/providers/fakerest/dataGenerator/types";
import {
  createGuestAuthProvider,
  createGuestDataProvider,
} from "./guestDataProvider";
import { guestDemoSessionKey, resetGuestDatabase } from "./guestDatabase";
import noxiraDark from "../src/noxira-mark-dark.svg";
import noxiraLight from "../src/noxira-mark-light.svg";

type DemoNoticeState = {
  storageError: string | null;
  resetting: boolean;
  resetData: () => Promise<void>;
};

const DemoNoticeContext = createContext<DemoNoticeState | null>(null);

function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "The browser could not save this change.";
}

function GuestDemoLayout({ children }: { children: React.ReactNode }) {
  const notice = useContext(DemoNoticeContext);

  return (
    <>
      <section
        aria-label="Guest demo notice"
        className="border-b border-blue-200 bg-blue-50 text-blue-950 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-100"
      >
        <div className="mx-auto flex max-w-screen-xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-blue-700 px-2.5 py-1 text-xs font-semibold text-white dark:bg-blue-400 dark:text-blue-950">
                Guest demo
              </span>
              <span className="text-sm font-medium">
                Fictional sample records - saved automatically in this browser
              </span>
            </div>
            <p className="max-w-4xl text-xs leading-relaxed text-blue-900/80 dark:text-blue-100/80">
              No sign-in, shared accounts, cloud sync, email delivery, or
              external integrations. Your changes stay in this browser.
            </p>
            {notice?.storageError && (
              <p
                role="alert"
                className="text-sm font-semibold text-red-700 dark:text-red-300"
              >
                Could not save locally: {notice.storageError}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => void notice?.resetData()}
            disabled={notice?.resetting}
            className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-md border border-blue-300 bg-white px-4 py-2 text-sm font-semibold text-blue-900 shadow-sm transition hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-wait disabled:opacity-60 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-100 dark:hover:bg-blue-900"
          >
            {notice?.resetting ? "Resetting..." : "Reset Demo Data"}
          </button>
        </div>
      </section>
      <Layout>{children}</Layout>
    </>
  );
}

function hasEnteredDemo(): boolean {
  try {
    return window.sessionStorage.getItem(guestDemoSessionKey) === "true";
  } catch {
    return false;
  }
}

export default function App({ initialDatabase }: { initialDatabase: Db }) {
  const [hasEntered, setHasEntered] = useState(hasEnteredDemo);

  if (!hasEntered) {
    return (
      <main className="min-h-screen bg-background px-6 py-12 text-foreground">
        <div className="mx-auto flex min-h-[75vh] max-w-3xl flex-col justify-center">
          <div className="mb-10 flex items-center gap-3">
            <img
              className="h-10 [.dark_&]:hidden"
              src={noxiraDark}
              alt="Noxira"
            />
            <img
              className="hidden h-10 [.dark_&]:block"
              src={noxiraLight}
              alt="Noxira"
            />
            <span className="text-2xl font-semibold">Noxira CRM</span>
          </div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Browser-only portfolio preview
          </p>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Explore a complete CRM workspace.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            This preview keeps Atomic CRM's contacts, companies, deals, tasks,
            notes, search, filters, and pipeline in the browser, with realistic
            fictional sample records.
          </p>
          <div className="mt-8 grid gap-3 rounded-xl border bg-card p-5 text-sm sm:grid-cols-2">
            <p>
              <strong>Private to this browser:</strong> changes save locally and
              survive refreshes on this device.
            </p>
            <p>
              <strong>No account needed:</strong> use the guest workspace
              without signing in.
            </p>
            <p>
              <strong>Not connected to services:</strong> email delivery, cloud
              sync, team accounts, and external integrations are unavailable.
            </p>
            <p>
              <strong>Reset any time:</strong> restore the original sample
              records from inside the demo.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              size="lg"
              onClick={() => {
                try {
                  window.sessionStorage.setItem(guestDemoSessionKey, "true");
                } catch {
                  // The guest demo still works for this tab when session storage is blocked.
                }
                setHasEntered(true);
              }}
            >
              Explore Demo
            </Button>
            <a
              className="text-sm font-medium text-muted-foreground underline underline-offset-4 hover:text-foreground"
              href="https://github.com/marmelab/atomic-crm"
              target="_blank"
              rel="noreferrer"
            >
              About the upstream project
            </a>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            All people, companies, email addresses, phone numbers, and deal
            figures shown are fictional sample data.
          </p>
        </div>
      </main>
    );
  }

  return <GuestCrm initialDatabase={initialDatabase} />;
}

function GuestCrm({ initialDatabase }: { initialDatabase: Db }) {
  const [storageError, setStorageError] = useState<string | null>(null);
  const [resetting, setResetting] = useState(false);
  const [dataProvider] = useState(() =>
    createGuestDataProvider(
      initialDatabase,
      (error) => setStorageError(getErrorMessage(error)),
      () => setStorageError(null),
    ),
  );
  const [authProvider] = useState(() => createGuestAuthProvider(dataProvider));
  const [store] = useState(() => memoryStore());

  const resetData = async () => {
    if (
      !window.confirm(
        "Reset this browser's Noxira CRM demo data? Your local changes will be removed and the fictional sample records will be restored.",
      )
    ) {
      return;
    }

    setResetting(true);
    try {
      await resetGuestDatabase();
      window.location.reload();
    } catch (error) {
      setStorageError(getErrorMessage(error));
      setResetting(false);
    }
  };

  const noticeState: DemoNoticeState = {
    storageError,
    resetting,
    resetData,
  };

  return (
    <DemoNoticeContext.Provider value={noticeState}>
      <CRM
        dataProvider={dataProvider}
        authProvider={authProvider}
        layout={GuestDemoLayout as LayoutComponent}
        store={store}
        title="Noxira CRM"
        darkModeLogo={noxiraLight}
        lightModeLogo={noxiraDark}
        lightTheme={{ palette: { primary: { main: "#2563eb" } } }}
        darkTheme={{ palette: { primary: { main: "#3b82f6" } } }}
        disableTelemetry
      />
    </DemoNoticeContext.Provider>
  );
}
