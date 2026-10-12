import { type ReactNode } from "react";

export const MobileContent = ({ children }: { children: ReactNode }) => (
  <main
    className="max-w-screen-xl mx-auto pt-[calc(4.5rem+var(--guest-demo-notice-offset,0px))] px-4 pb-20 min-h-screen overflow-y-auto"
    id="main-content"
  >
    {children}
  </main>
);
