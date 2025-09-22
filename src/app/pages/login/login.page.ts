import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonInput,
  IonButton, IonNote, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  ToastController
} from '@ionic/angular/standalone';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

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
    private toastCtrl: ToastController,
    private router: Router
  ) {}

  async onSubmit() {
    if (!this.loginForm.valid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.value;
    if (!email || !password) return;

    const res = await this.authService.login(email, password);

    if (res.success) {
      this.showToast('Inicio de sesión exitoso');
      this.router.navigate(['/home']);
    } else {
      this.showToast(this.firebaseErrorToMessage(res.message || 'Error al iniciar sesión'));
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
      default: return 'Ocurrió un error al iniciar sesión.';
    }
  }

  private async showToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2500, position: 'bottom' });
    toast.present();
  }
}
