import { createContext, useContext } from 'react';
import { AstronautFeatures } from "@space/core/astronaut.api.ts";
import { AstronautInternalError } from '@space/core/astronaut.error.js';

const AstronautFeaturesContext = createContext<AstronautFeatures | undefined>(undefined)

export const AstronautFeaturesProvider = AstronautFeaturesContext.Provider;

export function useAstronautFeatures(): AstronautFeatures {
  if (AstronautFeaturesContext !== undefined) {
    const context = useContext(AstronautFeaturesContext);

    if (context !== undefined) {
      return context;
    }
  }

  throw new AstronautInternalError(
    'Could not find AstronautFeaturesContext' +
      ' AstronautFeaturesProvider needs to exist in the component ancestry.',
  );
}