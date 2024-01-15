import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'events',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
