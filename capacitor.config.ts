import type { CapacitorConfig } from '@capacitor/cli';

// Determine the live server URL dynamically if needed, 
// usually you set this to your Vercel/live domain for production
const config: CapacitorConfig = {
  appId: 'com.shuddham.wellness',
  appName: 'SHUDDHAM',
  webDir: 'out',
  server: {
    url: 'https://shuddham-main.vercel.app',
  }
};

export default config;
