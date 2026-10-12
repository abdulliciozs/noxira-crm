import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Welcome = () => (
  <Card>
    <CardHeader className="px-4">
      <CardTitle>Noxira CRM Preview</CardTitle>
    </CardHeader>
    <CardContent className="px-4">
      <p className="text-sm mb-4">
        Explore the Noxira-branded CRM interface and sample workspace.
      </p>
      <p className="text-sm mb-4">
        This guest preview saves fictional sample data in this browser's local
        storage and keeps changes after a refresh. Use Reset Demo Data above to
        restore the original sample. It has no sign-in, shared accounts, cloud
        sync, email delivery, or external integrations.
      </p>
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
    </CardContent>
  </Card>
);
