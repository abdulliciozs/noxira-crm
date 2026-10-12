import { CRM } from "@/components/atomic-crm/root/CRM";
import {
  authProvider,
  dataProvider,
} from "@/components/atomic-crm/providers/fakerest";
import { memoryStore } from "ra-core";
import noxiraDark from "../src/noxira-mark-dark.svg";
import noxiraLight from "../src/noxira-mark-light.svg";

const App = () => (
  <CRM
    dataProvider={dataProvider}
    authProvider={authProvider}
    store={memoryStore()}
    title="Noxira CRM"
    darkModeLogo={noxiraLight}
    lightModeLogo={noxiraDark}
    lightTheme={{ palette: { primary: { main: "#2563eb" } } }}
    darkTheme={{ palette: { primary: { main: "#3b82f6" } } }}
    disableTelemetry
  />
);

export default App;
