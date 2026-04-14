import type { CapacitorConfig } from '@capacitor/cli';

// Determine the live server URL dynamically if needed, 
// usually you set this to your Vercel/live domain for production
const config: CapacitorConfig = {
  appId: 'com.shuddham.wellness',
  appName: 'SHUDDHAM',
  webDir: 'out',
  server: {
    // Keep next properties so it can connect to your deployed Server Actions backend.
    // For local android emulator testing, point it to your computer's IP address.
    // e.g., url: '10.0.2.2:3000' (emulator loopback) or 'http://YOUR_LOCAL_IP:3000'
    // url: 'https://your-production-url.com',
    cleartext: true
  }
};

export default config;
