import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonButton,
  IonIcon,
  IonCard,
  IonGrid,
  IonRow,
  IonCol,
  IonFab,
  IonFabButton,
  IonFabList,
  ToastController
} from '@ionic/angular/standalone';

import { addOutline, personCircleOutline, logOutOutline, menuOutline, trashOutline, eyeOutline } from 'ionicons/icons';

import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

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
    IonGrid,
    IonRow,
    IonCol,
    IonFab,
    IonFabButton,
    IonFabList
  ],
})
export class HomePage implements OnInit {
  wallpapers: string[] = [];

  // Icons
  menuIcon = menuOutline;
  addIcon = addOutline;
  profileIcon = personCircleOutline;
  logoutIcon = logOutOutline;
  deleteIcon = trashOutline;
  viewIcon = eyeOutline;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    console.log('HomePage initialized');

  }
  goToProfile() {
  this.router.navigate(['/updateprofile']);
}


  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        // Local preview
        this.wallpapers.push(reader.result as string);
     
      };
      reader.readAsDataURL(file);
    }
  }

  viewWallpaper(wallpaper: string) {
    console.log('View wallpaper:', wallpaper);

  }

  deleteWallpaper(index: number) {
    this.wallpapers.splice(index, 1);

  }

  async logout() {
    const res = await this.authService.logout();
    if (res.success) {
      this.router.navigate(['/login']);
    } else {
      this.showToast('Error al cerrar sesión');
    }
  }

  private async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
}
