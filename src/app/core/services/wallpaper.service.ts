import { Injectable } from '@angular/core';
import { MyWallpaper } from 'my-wallpaper-plugin';

@Injectable({ providedIn: 'root' })
export class WallpaperService {

  async setLockScreenWallpaper(url: string) {
    try {
      await MyWallpaper.setLockScreenWallpaper({ path: url });
      return { success: true };
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  }

  async setHomeScreenWallpaper(url: string) {
    try {
      await MyWallpaper.setHomeScreenWallpaper({ path: url });
      return { success: true };
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  }
}
