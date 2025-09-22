import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonButton, IonIcon, IonCard, IonGrid, IonRow, IonCol,
  IonFab, IonFabButton, IonFabList, ToastController, IonModal, IonSelect, IonSelectOption
} from '@ionic/angular/standalone';
import { addOutline, personCircleOutline, logOutOutline, menuOutline, trashOutline, eyeOutline } from 'ionicons/icons';
import { AuthService } from '../../core/services/auth.service';
import { SupabaseService } from '../../core/services/supabase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [
    CommonModule, FormsModule, IonContent, IonButton, IonCard, IonGrid, IonRow, IonCol,
    IonIcon, IonFab, IonFabButton, IonFabList, IonModal, IonSelect, IonSelectOption
  ],
})
export class HomePage implements OnInit {
  wallpapers: { name: string; url: string }[] = [];
  userId: string | null = null;
  userEmail: string | null = null;
  selectedType: 'home' | 'lock' = 'home';

  menuIcon = menuOutline; addIcon = addOutline; profileIcon = personCircleOutline;
  logoutIcon = logOutOutline; deleteIcon = trashOutline; viewIcon = eyeOutline;

  @ViewChild(IonModal) modal!: IonModal;
  selectedWallpaperUrl: string | null = null;
  uploading = false;

  constructor(
    private authService: AuthService,
    private supabaseService: SupabaseService,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  async ngOnInit() {
    const authUser = this.authService.getCurrentUser();
    if (!authUser) {
      this.router.navigate(['/login']);
      return;
    }
    this.userId = authUser.uid;
    this.userEmail = authUser.email;
    if (this.userId) {
      this.wallpapers = await this.supabaseService.listFiles(this.userId);
    }
  }

  goToProfile() {
    this.router.navigate(['/updateprofile']);
  }

  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return this.showToast('Solo se permiten imágenes');
    if (file.size > 5 * 1024 * 1024) return this.showToast('Archivo > 5MB');
    if (this.uploading) return this.showToast('Subida en progreso');
    if (!this.userId) return this.showToast('Usuario no autenticado');

    this.uploading = true;
    const res = await this.supabaseService.uploadFile(file, this.userId, this.selectedType);
    this.uploading = false;

    if (res.success && res.url) {
      this.wallpapers.unshift({ name: res.path!, url: res.url });
      this.showToast('Wallpaper subido');
    } else {
      this.showToast('Error subiendo: ' + res.message);
    }
  }

  viewWallpaper(wallpaper: { name: string; url: string }) {
    this.selectedWallpaperUrl = wallpaper.url;
    this.modal.present();
  }

  closeModal() {
    this.modal.dismiss();
    this.selectedWallpaperUrl = null;
  }

  async deleteWallpaper(index: number) {
    if (!this.userId) return this.showToast('Usuario no autenticado');
    const wallpaper = this.wallpapers[index];
    const res = await this.supabaseService.deleteFile(wallpaper.name);
    if (res.success) {
      this.wallpapers.splice(index, 1);
      this.showToast('Wallpaper eliminado');
    } else {
      this.showToast('Error al eliminar: ' + res.message);
    }
  }

  async logout() {
    const res = await this.authService.logout();
    if (res.success) this.router.navigate(['/login']);
    else this.showToast('Error al cerrar sesión');
  }

  private async showToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000, position: 'bottom' });
    toast.present();
  }
}
