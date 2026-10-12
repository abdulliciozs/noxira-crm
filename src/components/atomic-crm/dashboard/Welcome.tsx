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
        This preview uses a mock API and sample data. Changes reset on reload.
        The full application uses Supabase for authentication and persistence;
        this preview is not a shared CRM service.
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
