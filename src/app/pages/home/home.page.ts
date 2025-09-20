import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonFab,
  IonFabButton,
  IonFabList
} from '@ionic/angular/standalone';

// ICo
import { addOutline, personCircleOutline, logOutOutline, menuOutline, trashOutline, eyeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonButton,
    IonIcon,
    IonCard,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
    IonFab,
    IonFabButton,
    IonFabList
  ],
})
export class HomePage {
  wallpapers: string[] = [];

  // Ico FAB
  menuIcon = menuOutline;
  addIcon = addOutline;
  profileIcon = personCircleOutline;
  logoutIcon = logOutOutline;
  deleteIcon = trashOutline;
  viewIcon = eyeOutline;

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.wallpapers.push(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  viewWallpaper(wallpaper: string) {
    console.log('Ver wallpaper:', wallpaper);
  }

  deleteWallpaper(index: number) {
    this.wallpapers.splice(index, 1);
  }

  logout() {
    console.log('Cerrar sesión');
  }
}
