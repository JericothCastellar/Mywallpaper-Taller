import { Injectable } from '@angular/core';
import { supabase } from '../supabase.init';
import { v4 as uuidv4 } from 'uuid';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private bucket = 'wallpapers';

  async uploadFile(
    file: File,
    userId: string,
    type: 'home' | 'lock'
  ): Promise<{ success: boolean; url?: string; path?: string; message?: string }> {
    try {
      const ext = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${ext}`;
      const filePath = `${userId}/${type}/${fileName}`;

      const { error: uploadError } = await supabase
        .storage
        .from(this.bucket)
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        return { success: false, message: uploadError.message };
      }

       const { data } = supabase.storage.from(this.bucket).getPublicUrl(filePath);

      return {
        success: true,
        url: data.publicUrl,
        path: filePath
      };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  }


  async listFiles(
    userId: string,
    type?: 'home' | 'lock'
  ): Promise<{ name: string; url: string }[]> {
    const folder = type ? `${userId}/${type}` : userId;

    const { data, error } = await supabase
      .storage
      .from(this.bucket)
      .list(folder, { limit: 100 });

    if (error || !data) return [];

    const files: { name: string; url: string }[] = [];

    for (const file of data) {
      const fullPath = `${folder}/${file.name}`;
      const { data: pub } = supabase
        .storage
        .from(this.bucket)
        .getPublicUrl(fullPath);

      if (pub?.publicUrl) {
        files.push({ name: fullPath, url: pub.publicUrl });
      }
    }

    return files;
  }

  /**

   * @param path 
   */
  async deleteFile(path: string): Promise<{ success: boolean; message?: string }> {
    try {
      const { error } = await supabase
        .storage
        .from(this.bucket)
        .remove([path]);

      if (error) {
        return { success: false, message: error.message };
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  }
}
