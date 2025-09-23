import { registerPlugin } from '@capacitor/core';

export interface MyWallpaperPlugin {
  echo(options: { value: string }): Promise<{ value: string }>;
  setHomeScreenWallpaper(options: { imagePath: string }): Promise<{ success: boolean }>;
  setLockScreenWallpaper(options: { imagePath: string }): Promise<{ success: boolean }>;
}

const MyWallpaper = registerPlugin<MyWallpaperPlugin>('MyWallpaperPlugin');

export default MyWallpaper;
