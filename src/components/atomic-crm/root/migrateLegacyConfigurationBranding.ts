import type { ConfigurationContextValue } from "./ConfigurationContext";
import { defaultConfiguration } from "./defaultConfiguration";
import legacyDarkModeLogo from "./logos/logo_atomic_crm_dark.svg";
import legacyLightModeLogo from "./logos/logo_atomic_crm_light.svg";

/**
 * Replace only untouched upstream branding values. User-edited CRM settings
 * and all record data stay intact when an older Atomic configuration is read.
 */
export function migrateLegacyConfigurationBranding(
  config: ConfigurationContextValue,
): ConfigurationContextValue {
  let migrated: ConfigurationContextValue | undefined;
  const update = (
    key: "title" | "darkModeLogo" | "lightModeLogo",
    value: string,
  ) => {
    migrated ??= { ...config };
    migrated[key] = value;
  };

  if (config.title === "Atomic CRM") {
    update("title", defaultConfiguration.title);
  }
  if (config.darkModeLogo === legacyDarkModeLogo) {
    update("darkModeLogo", defaultConfiguration.darkModeLogo);
  }
  if (config.lightModeLogo === legacyLightModeLogo) {
    update("lightModeLogo", defaultConfiguration.lightModeLogo);
  }

  return migrated ?? config;
}
