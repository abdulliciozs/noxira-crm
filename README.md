# Noxira CRM

Noxira-branded adaptation of [Atomic CRM](https://github.com/marmelab/atomic-crm), an open-source React and Supabase CRM by Marmelab.

<https://github.com/user-attachments/assets/0d7554b5-49ef-41c6-bcc9-a76214fc5c99>

Noxira CRM includes a browser-only guest preview. It uses IndexedDB for this browser's sample workspace; it does not connect to a CRM backend or create shared accounts.

## Upstream Atomic CRM features

The list below describes the full upstream product. The browser-only Noxira guest preview and its limits are described separately below.

- 📇 **Organize Contacts**: Keep all your contacts in one easily accessible place.
- ⏰ **Create Tasks & Set Reminders**: Never miss a follow-up or deadline.
- 📝 **Take Notes**: Capture important details and insights effortlessly.
- ✉️ **Capture Emails**: CC Atomic CRM to automatically save communications as notes.
- 📊 **Manage Deals**: Visualize and track your sales pipeline in a Kanban board.
- 🔄 **Import & Export Data**: Easily transfer contacts in and out of the system.
- 🔐 **Control Access**: Log in with Google, Azure, Keycloak, and Auth0.
- 📜 **Track Activity History**: View all interactions in aggregated activity logs.
- 🔗 **Integrate via API**: Connect seamlessly with other systems using our API.
- 🛠️ **Customize Everything**: Add custom fields, change the theme, and replace any component to fit your needs.
- 📦 **Stay Up To Date**: Pull the latest component updates into your fork via the Atomic CRM shadcn registry.

## Noxira guest demo

The demo opens with an **Explore Demo** entry and requires no sign-in. It preserves the Atomic CRM interface and uses the existing browser FakeRest data provider, backed by IndexedDB for persistent local data.

- **Fictional records:** the initial contacts, companies, leads, tasks, notes, and deal pipeline are generated as sample data on first use. Sample contact emails use the reserved example.test domain and sample phone numbers use the reserved 202-555-01xx range.
- **Browser-local persistence:** changes save after successful CRM data-provider mutations and remain in this browser across refreshes and later visits. Each browser profile has its own separate database.
- **Reset:** choose **Reset Demo Data** in the guest notice and confirm to replace the current browser-local records with a fresh fictional sample. Storage versions are checked; unsupported or incomplete saved data is preserved until an explicit reset.
- **Unavailable services:** real authentication, password recovery, team accounts, cloud sync, email delivery, and external integrations are not connected. Account and configuration administration are hidden or rejected where those server services would be required. Do not enter real customer information.
- **Local preview:** run `npm run dev:demo` after installing the project dependencies. No Supabase project is used by the guest preview.

## Installation

To run this project locally, you will need the following tools installed on your computer:

- Make
- Node 24 LTS
- Docker (required by Supabase)

Clone this fork or the upstream [`marmelab/atomic-crm`](https://github.com/marmelab/atomic-crm) repository:

```sh
git clone https://github.com/abdulliciozs/noxira-crm.git
```

Install dependencies:

```sh
cd noxira-crm
make install
```

This will install the dependencies for the frontend and the backend, including a local Supabase instance.

Once your app is configured, start the app locally with the following command:

```sh
make start
```

This will start the Vite dev server for the frontend, the local Supabase instance for the API, and a Postgres database (thanks to Docker).

You can then access the app via [http://localhost:5173/](http://localhost:5173/). You will be prompted to create the first user.

If you need debug the backend, you can access the following services:

- Supabase dashboard: [http://localhost:54323/](http://localhost:54323/)
- REST API: [http://127.0.0.1:54321](http://127.0.0.1:54321)
- Attachments storage: [http://localhost:54323/project/default/storage/buckets/attachments](http://localhost:54323/project/default/storage/buckets/attachments)
- Inbucket email testing service: [http://localhost:54324/](http://localhost:54324/)

## Documentation

The user and developer documentation for this project is available [in the `doc/` directory](./doc/). You can also read it online at [https://marmelab.com/atomic-crm/doc/](https://marmelab.com/atomic-crm/doc/).

## Testing Changes

This project contains unit tests and e2e. 
Run unit test with the following command:

```sh
make test
```

Run e2e test with:

```sh
make test-e2e
```

Note: the `make test-e2e` will run the the e2e test in ui mode against a vite server with hot reload for ease of development. On the CI the e2e test will be run against the built app. If you need to run the test against the built file instead. You can run:

```sh
make start-e2e-ci # To launch the CI e2e environment (serving the built app)
# followed by
npx playwright test --ui
```

You can add your own unit tests powered by Jest anywhere in the `src` directory. The test files should be named `*.test.tsx` or `*.test.ts`.
And you can also add your own e2e test. The e2e test files should be placed inside the `./e2e` folder

## Shadcn Registry

Atomic CRM components are published as a [shadcn registry](https://marmelab.com/atomic-crm/r/atomic-crm.json). This registry can't be used to bootstrap a new CRM app (use [Installation](#installation) for that), but it's a convenient way to keep the components you forked in sync with upstream.

### For Users: Getting Updates

Once you've forked and customized Atomic CRM, periodically run the following command to pull in the latest component updates:

```sh
npx shadcn add https://marmelab.com/atomic-crm/r/atomic-crm.json -o -y
```

- `-o` overwrites the files that changed upstream
- `-y` skips the confirmation prompt (prefer this over piping `yes |` into the command)

Commit your work before running this command so you can review the diff and resolve any conflict with your own customizations. See the [Getting Updates](https://marmelab.com/atomic-crm/doc/developers/getting-updates/) chapter of the documentation for details.

### For Contributors: How The Registry Is Built

The registry file is kept up to date automatically:

- The `registry.json` file is automatically generated by the `scripts/generate-registry.mjs` script as a pre-commit hook (`make registry-gen`).
- The `https://marmelab.com/atomic-crm/r/atomic-crm.json` file is automatically built and published by the CI/CD pipeline (`make registry-build`, `make registry-deploy`).

> [!WARNING]  
> If the `registry.json` misses some changes you made, you MUST update the `scripts/generate-registry.mjs` to include those changes.

## License

This project is licensed under the MIT License, courtesy of [Marmelab](https://marmelab.com). See the [LICENSE.md](./LICENSE.md) file for details.

## Noxira CRM portfolio adaptation

This fork applies Noxira's product name, official mark, and existing blue product palette to Marmelab's Atomic CRM. The core CRM UI and its MIT license and upstream notices are retained. The guest preview runs locally in each visitor's browser and is not a shared CRM service.

Upstream source: [marmelab/atomic-crm](https://github.com/marmelab/atomic-crm) | License: MIT (see LICENSE.md).
