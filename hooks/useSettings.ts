import { useCallback, useState } from 'react';

export type AdvancedSettings<T> = {
  autoPlay: boolean;
  autoPlayInterval: number;
  autoPlayReverse: boolean;
  data: T[];
  loop: boolean;
  pagingEnabled: boolean;
  snapEnabled: boolean;
  vertical: boolean;
};

export function useAdvancedSettings<T>(args: { defaultSettings: AdvancedSettings<T> }) {
  const [advancedSettings, setAdvancedSettings] = useState<AdvancedSettings<T>>(
    args.defaultSettings
  );

  const onAdvancedSettingsChange = useCallback((patch: Partial<AdvancedSettings<T>>) => {
    setAdvancedSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  return { advancedSettings, onAdvancedSettingsChange };
}
