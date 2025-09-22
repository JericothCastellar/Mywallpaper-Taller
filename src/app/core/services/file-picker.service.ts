import { Injectable } from '@angular/core';
import { FilePicker } from '@capawesome/capacitor-file-picker';

@Injectable({
  providedIn: 'root'
})
export class FilePickerService {

  async pickImage(): Promise<Blob | null> {
    try {
      const result = await FilePicker.pickFiles({
        types: ['image/*'],
        limit: 1,
        readData: true
      });

      if (!result.files.length) return null;

      const file = result.files[0];

      if (file.blob) {
        return file.blob;
      }

      if (file.data) {
        const byteCharacters = atob(file.data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: file.mimeType || 'image/*' });
      }

      return null;
    } catch {
      return null;
    }
  }
}
