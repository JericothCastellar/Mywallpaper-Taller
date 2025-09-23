import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonInput,
  IonButton, IonNote, IonCard, IonCardContent, IonCardHeader, IonCardTitle
} from '@ionic/angular/standalone';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { I18nService } from '../../core/services/i18n.service';
import { ToastService } from '../../core/services/toast.service';
import { LoadingService } from '../../core/services/loading.service'; 

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, RouterModule,
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonItem, IonLabel, IonInput, IonButton, IonNote, IonCard,
    IonCardContent, IonCardHeader, IonCardTitle
  ]
})
export class LoginPage {
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    public i18n: I18nService,
    private toast: ToastService,
    private loading: LoadingService 
  ) {}

  async onSubmit() {
    if (!this.loginForm.valid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.value;
    if (!email || !password) return;

    await this.loading.show(this.i18n.translate('LOGIN.BUTTON'));

    try {
      const res = await this.authService.login(email, password);
      await this.loading.hide();

      if (res.success) {
        this.toast.show(this.i18n.translate('LOGIN.SUCCESS'));
        this.router.navigate(['/home']);
      }
    } catch (err: any) {
      await this.loading.hide();
      const msg = this.firebaseErrorToMessage(err?.message || '');
      this.toast.show(msg, 2500, 'danger');
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  private firebaseErrorToMessage(error: string): string {
    switch (error) {
      case 'Firebase: Error (auth/user-not-found).': return 'Usuario no encontrado.';
      case 'Firebase: Error (auth/wrong-password).': return 'Contraseña incorrecta.';
      case 'Firebase: Error (auth/invalid-email).': return 'Correo inválido.';
      default: return this.i18n.translate('LOGIN.ERROR');
    }
  }
}
