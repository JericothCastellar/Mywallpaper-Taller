import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonButton,
  IonNote, IonCard, IonCardContent, IonCardHeader, IonCardTitle, 
  ToastController, LoadingController, 
} from '@ionic/angular/standalone';

import { AuthService, AuthResult } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { FirebaseError } from 'firebase/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ReactiveFormsModule,
    IonItem, IonLabel, IonInput, IonButton, IonNote, IonCard, IonCardContent, IonCardHeader,
    IonCardTitle
  ],
})
export class LoginPage implements OnInit {
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('LoginPage initialized');
  }

  async onSubmit() {
    if (!this.loginForm.valid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const loadingEl = await this.loadingCtrl.create({
      message: 'Iniciando sesión...',
      spinner: 'crescent',
      duration: 0
    });
    await loadingEl.present();

    const { email, password } = this.loginForm.value;
    const res: AuthResult = await this.authService.login(email!, password!);

    if (res.success) {
      this.showToast('Bienvenido');

      const currentUser = this.authService.getCurrentUser();
      if (currentUser) {
        await loadingEl.dismiss();
        this.router.navigate(['/home']);
      } else {
        const sub = this.authService.user$.subscribe(async (user) => {
          if (user) {
            await loadingEl.dismiss();
            this.router.navigate(['/home']);
            sub.unsubscribe();
          }
        });
      }
    } else {
      await loadingEl.dismiss();
      // Mostramos mensaje claro usando code o message
      const message = res.code || res.message || 'Ocurrió un error, intenta de nuevo.';
      this.showToast(this.firebaseErrorToMessage(message));
    }
  }

  private firebaseErrorToMessage(codeOrMsg: string): string {
    switch (codeOrMsg) {
      case 'auth/user-not-found':
        return 'Usuario no encontrado.';
      case 'auth/wrong-password':
        return 'Contraseña incorrecta.';
      case 'auth/invalid-email':
        return 'Correo inválido.';
      case 'auth/user-disabled':
        return 'Usuario deshabilitado.';
      case 'auth/too-many-requests':
        return 'Demasiados intentos, intenta más tarde.';
      default:
 
        return codeOrMsg || 'Ocurrió un error, intenta de nuevo.';
    }
  }

  private async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2500,
      position: 'bottom'
    });
    toast.present();
  }
  goToRegister() {
  this.router.navigate(['/register']);
}
}
