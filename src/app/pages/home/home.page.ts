import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonButton, IonIcon, IonCard, IonGrid, IonRow, IonCol,
  IonFab, IonFabButton, IonFabList, IonModal
} from '@ionic/angular/standalone';
import {
  addOutline, personCircleOutline, logOutOutline,
  menuOutline, trashOutline, eyeOutline
} from 'ionicons/icons';
import { AuthService } from '../../core/services/auth.service';
import { SupabaseService } from '../../core/services/supabase.service';
import { Router } from '@angular/router';
import { I18nService } from '../../core/services/i18n.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [
    CommonModule, FormsModule, IonContent, IonButton, IonCard, IonGrid, IonRow, IonCol,
    IonIcon, IonFab, IonFabButton, IonFabList, IonModal
  ],
})
export class HomePage implements OnInit {
  wallpapers: { name: string; url: string }[] = [];
  userId: string | null = null;
  userEmail: string | null = null;
  selectedType: 'home' | 'lock' = 'home';

  menuIcon = menuOutline;
  addIcon = addOutline;
  profileIcon = personCircleOutline;
  logoutIcon = logOutOutline;
  deleteIcon = trashOutline;
  viewIcon = eyeOutline;

  @ViewChild(IonModal) modal!: IonModal;
  selectedWallpaperUrl: string | null = null;
  uploading = false;

  constructor(
    private authService: AuthService,
    private supabaseService: SupabaseService,
    private router: Router,
    public i18n: I18nService,
    private toast: ToastService
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
      const res = await this.supabaseService.listFiles(this.userId);
      if (Array.isArray(res)) {
        this.wallpapers = res;
      }
    }
  }

  goToProfile() {
    this.router.navigate(['/updateprofile']);
  }

  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/'))
      return this.toast.show(this.i18n.translate('HOME.ONLY_IMAGES'));
    if (file.size > 5 * 1024 * 1024)
      return this.toast.show(this.i18n.translate('HOME.FILE_TOO_BIG'));
    if (this.uploading)
      return this.toast.show(this.i18n.translate('HOME.UPLOAD_IN_PROGRESS'));
    if (!this.userId)
      return this.toast.show(this.i18n.translate('HOME.NOT_AUTH'));

    this.uploading = true;
    await this.toast.showLoader(this.i18n.translate('HOME.UPLOADING'));
    const res = await this.supabaseService.uploadFile(file, this.userId, this.selectedType);
    await this.toast.hideLoader();
    this.uploading = false;

    if (res.success && res.url) {
      this.wallpapers.unshift({ name: res.path!, url: res.url });
      this.toast.show(this.i18n.translate('HOME.UPLOADED'));
    } else {
      this.toast.show(this.i18n.translate('HOME.ERROR_UPLOADING') + ': ' + res.message, 2500, 'danger');
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
    if (!this.userId) return this.toast.show(this.i18n.translate('HOME.NOT_AUTH'));
    const wallpaper = this.wallpapers[index];
    await this.toast.showLoader(this.i18n.translate('HOME.DELETING'));
    const res = await this.supabaseService.deleteFile(wallpaper.name);
    await this.toast.hideLoader();

    if (res.success) {
      this.wallpapers.splice(index, 1);
      this.toast.show(this.i18n.translate('HOME.DELETED'));
    } else {
      this.toast.show(this.i18n.translate('HOME.ERROR_DELETING') + ': ' + res.message, 2500, 'danger');
    }
  }

  async logout() {
    const res = await this.authService.logout();
    if (res.success) {
      this.toast.show(this.i18n.translate('HOME.LOGGED_OUT'));
      this.router.navigate(['/login']);
    } else {
      this.toast.show(this.i18n.translate('HOME.ERROR_LOGOUT'), 2500, 'danger');
    }
  }
}
