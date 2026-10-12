import { useEffect, useMemo } from "react";
import { useStore } from "ra-core";

import type { DealStage, LabeledValue, NoteStatus } from "../types";
import { defaultConfiguration } from "./defaultConfiguration";
import { migrateLegacyConfigurationBranding } from "./migrateLegacyConfigurationBranding";

export const CONFIGURATION_STORE_KEY = "app.configuration";

export interface ConfigurationContextValue {
  companySectors: LabeledValue[];
  currency: string;
  dealCategories: LabeledValue[];
  dealPipelineStatuses: string[];
  dealStages: DealStage[];
  noteStatuses: NoteStatus[];
  taskTypes: LabeledValue[];
  title: string;
  darkModeLogo: string;
  lightModeLogo: string;
}

export const useConfigurationContext = () => {
  const [config, setConfig] = useStore<ConfigurationContextValue>(
    CONFIGURATION_STORE_KEY,
    defaultConfiguration,
  );
  const migratedConfig = useMemo(
    () => migrateLegacyConfigurationBranding(config),
    [config],
  );
  useEffect(() => {
    if (migratedConfig !== config) {
      setConfig(migratedConfig);
    }
  }, [config, migratedConfig, setConfig]);
  // Merge with defaults so that missing fields in stored config
  // fall back to default values (e.g. when new settings are added)
  return useMemo(
    () => ({ ...defaultConfiguration, ...migratedConfig }),
    [migratedConfig],
  );
};

export const useConfigurationUpdater = () => {
  const [, setConfig] = useStore<ConfigurationContextValue>(
    CONFIGURATION_STORE_KEY,
  );
  return setConfig;
};
