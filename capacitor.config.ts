import type { CapacitorConfig } from '@capacitor/cli';

// Determine the live server URL dynamically if needed, 
// usually you set this to your Vercel/live domain for production
const config: CapacitorConfig = {
  appId: 'com.shuddham.wellness',
  appName: 'SHUDDHAM',
  webDir: 'out',
  server: {
    url: 'http://192.168.1.10:3000',
    cleartext: true
  }
};

export default config;
