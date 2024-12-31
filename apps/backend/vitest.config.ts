/// <refrerence types="vitest">
import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";


export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
console.log(env['DATABASE_URL']);
  return {
    define: {
      'import.meta.env.ENV_VARIABLE': env['DATABASE_URL']
    }
  }
});
