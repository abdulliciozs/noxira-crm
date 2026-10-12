import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const UpstreamCredit = () => (
  <p className="text-sm">
    Built on{" "}
    <a
      href="https://marmelab.com/shadcn-admin-kit"
      className="underline hover:no-underline"
    >
      shadcn-admin-kit
    </a>
    , with attribution to Marmelab's open-source Atomic CRM project. Source:{" "}
    <a
      href="https://github.com/marmelab/atomic-crm"
      className="underline hover:no-underline"
    >
      marmelab/atomic-crm
    </a>
    .
  </p>
);

export const Welcome = () => (
  <>
    <Card className="hidden md:block">
      <CardHeader className="px-4">
        <CardTitle>Noxira CRM Preview</CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        <p className="text-sm mb-4">
          Explore the Noxira-branded CRM interface and sample workspace.
        </p>
        <p className="text-sm mb-4">
          This guest preview saves fictional sample data in this browser's local
          database and keeps changes after a refresh. Use Reset Demo Data above
          to restore the original sample. It has no sign-in, shared accounts,
          cloud sync, email delivery, or external integrations.
        </p>
        <UpstreamCredit />
      </CardContent>
    </Card>
    <details className="rounded-lg border bg-card px-4 py-3 text-sm md:hidden">
      <summary className="cursor-pointer font-semibold">
        About this Noxira CRM guest demo
      </summary>
      <div className="mt-3 space-y-3 text-muted-foreground">
        <p>
          Fictional sample records only. Changes save in this browser and
          survive refreshes. Reset Demo Data restores the original sample. There
          is no sign-in, shared account, cloud sync, email delivery, or external
          integration.
        </p>
        <UpstreamCredit />
      </div>
    </details>
  </>
);
