import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AstronautFeaturesProvider } from './hooks/useAstronautFeatures'
import { fetchApi } from './api/fetch'
import { FetchAstronautApi } from './api/astronauts.api'
import { makeAstronautFeatures } from '@space/core/astronaut.app.ts'

const astronautsApi = new FetchAstronautApi(fetchApi);
const astronautUsecases = makeAstronautFeatures(astronautsApi);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AstronautFeaturesProvider value={astronautUsecases}>
      <App />
    </AstronautFeaturesProvider>
  </StrictMode>,
)
