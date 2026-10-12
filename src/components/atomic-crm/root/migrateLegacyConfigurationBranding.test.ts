import { describe, expect, it } from "vitest";
import { defaultConfiguration } from "./defaultConfiguration";
import { migrateLegacyConfigurationBranding } from "./migrateLegacyConfigurationBranding";
import legacyDarkModeLogo from "./logos/logo_atomic_crm_dark.svg";
import legacyLightModeLogo from "./logos/logo_atomic_crm_light.svg";

describe("migrateLegacyConfigurationBranding", () => {
  it("updates only untouched Atomic branding and retains all CRM settings", () => {
    const legacy = {
      ...defaultConfiguration,
      title: "Atomic CRM",
      darkModeLogo: legacyDarkModeLogo,
      lightModeLogo: legacyLightModeLogo,
      currency: "EUR",
      dealStages: [{ value: "custom", label: "Custom" }],
    };

    expect(migrateLegacyConfigurationBranding(legacy)).toEqual({
      ...legacy,
      title: "Noxira CRM",
      darkModeLogo: defaultConfiguration.darkModeLogo,
      lightModeLogo: defaultConfiguration.lightModeLogo,
    });
  });

  it("keeps custom branding and settings unchanged", () => {
    const custom = {
      ...defaultConfiguration,
      title: "My CRM",
      darkModeLogo: "/custom-dark.svg",
      lightModeLogo: "/custom-light.svg",
      currency: "CAD",
    };

    expect(migrateLegacyConfigurationBranding(custom)).toBe(custom);
  });
});
