import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'Mywallpaper',
  webDir: 'www',
  plugins: {
    MyWallpaperPlugin: {
      android: {
        class: 'com.mycompany.plugins.example.MyWallpaperPluginPlugin'
      }
    }
  }
};

export default config;
