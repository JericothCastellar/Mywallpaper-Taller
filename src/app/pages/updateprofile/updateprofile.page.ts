import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  IonContent, IonItem, IonLabel, IonInput, IonButton,
  IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonNote, IonGrid, IonRow, IonCol, IonIcon
} from '@ionic/angular/standalone';
import { AuthService } from '../../core/services/auth.service';
import { I18nService } from '../../core/services/i18n.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-updateprofile',
  templateUrl: './updateprofile.page.html',
  styleUrls: ['./updateprofile.page.scss'],
  standalone: true,
  imports: [
    IonContent, CommonModule, FormsModule, ReactiveFormsModule,
    IonItem, IonLabel, IonInput, IonButton,
    IonCard, IonCardContent, IonCardHeader, IonCardTitle,
    IonNote, IonGrid, IonRow, IonCol, IonIcon, RouterModule
  ],
})
export class UpdateProfilePage implements OnInit {
  profileForm = this.fb.group({
    name: ['', [Validators.minLength(2)]],
    lastname: ['', [Validators.minLength(2)]],
    email: ['', [Validators.email]],
    password: ['', [Validators.minLength(6)]],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    public i18n: I18nService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.profileForm.patchValue({
        name: currentUser.displayName?.split(' ')[0] || '',
        lastname: currentUser.displayName?.split(' ')[1] || '',
        email: currentUser.email || ''
      });
    }
  }

  async onSubmit() {
    if (this.profileForm.valid) {
      const formValues = this.profileForm.value as {
        name?: string | null;
        lastname?: string | null;
        email?: string | null;
        password?: string | null;
      };

      const updatedData: { name?: string; lastname?: string; email?: string; password?: string } = {};
      (Object.keys(formValues) as (keyof typeof formValues)[]).forEach(key => {
        const value = formValues[key];
        if (value) {
          updatedData[key] = value;
        }
      });

      if (Object.keys(updatedData).length > 0) {
        await this.toast.showLoader(this.i18n.translate('PROFILE.UPDATING'));
        const res = await this.authService.updateProfile(updatedData);
        await this.toast.hideLoader();

        if (res.success) {
          this.toast.show(this.i18n.translate('PROFILE.UPDATED'));
          this.router.navigate(['/home']);
        } else {
          this.toast.show(this.i18n.translate('PROFILE.ERROR_UPDATING') + ': ' + res.message, 2500, 'danger');
        }
      } else {
        this.toast.show(this.i18n.translate('PROFILE.NO_CHANGES'));
      }
    } else {
      this.profileForm.markAllAsTouched();
      this.toast.show(this.i18n.translate('PROFILE.INVALID_FORM'), 2500, 'danger');
    }
  }
}
