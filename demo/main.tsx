import { StrictMode, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import "../src/index.css";
import App from "./App";
import noxiraMark from "../src/noxira-mark-dark.svg";
import { loadOrSeedGuestDatabase, resetGuestDatabase } from "./guestDatabase";

const root = createRoot(document.getElementById("root")!);

function render(element: ReactNode) {
  root.render(<StrictMode>{element}</StrictMode>);
}

function LoadingScreen() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <div
        role="status"
        className="flex items-center gap-4 rounded-xl border bg-card p-6 shadow-sm"
      >
        <img src={noxiraMark} alt="" className="h-9 w-9" />
        <div>
          <h1 className="font-semibold">Loading Noxira CRM</h1>
          <p className="text-sm text-muted-foreground">
            Opening your browser-only guest workspace…
          </p>
        </div>
      </div>
    </main>
  );
}

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Noxira CRM could not open browser storage.";
}

async function boot() {
  render(<LoadingScreen />);

  try {
    const initialDatabase = await loadOrSeedGuestDatabase();
    render(<App initialDatabase={initialDatabase} />);
  } catch (error) {
    const message = getErrorMessage(error);
    render(
      <main className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
        <section className="w-full max-w-xl rounded-xl border bg-card p-6 shadow-sm">
          <img src={noxiraMark} alt="" className="mb-5 h-9 w-9" />
          <h1 className="text-xl font-semibold">
            Guest demo storage unavailable
          </h1>
          <p
            role="alert"
            className="mt-3 text-sm leading-relaxed text-muted-foreground"
          >
            {message}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Your saved data has not been cleared. Retry after enabling browser
            storage, or explicitly reset this browser’s demo database.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
              onClick={() => void boot()}
            >
              Retry
            </button>
            <button
              type="button"
              className="rounded-md border px-4 py-2 text-sm font-semibold"
              onClick={async () => {
                if (
                  !window.confirm(
                    "Delete this browser's saved guest demo data and restore a fresh fictional sample?",
                  )
                ) {
                  return;
                }

                try {
                  await resetGuestDatabase();
                  await boot();
                } catch (resetError) {
                  window.alert(getErrorMessage(resetError));
                }
              }}
            >
              Reset browser demo storage
            </button>
          </div>
        </section>
      </main>,
    );
  }
}

void boot();
