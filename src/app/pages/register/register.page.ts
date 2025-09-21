import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonButton,
  IonNote, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonSelect, IonSelectOption,
  ToastController
} from '@ionic/angular/standalone';

import { AuthService } from '../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ReactiveFormsModule,
    IonItem, IonLabel, IonInput, IonButton, IonNote, IonCard, IonCardContent, IonCardHeader,
    IonCardTitle, IonSelect, IonSelectOption, RouterModule
  ],
})
export class RegisterPage implements OnInit {

  registerForm = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    apellido: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    language: ['Español', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('RegisterPage initialized');
  }

  async onSubmit() {
    if (!this.registerForm.valid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { nombre, apellido, email, password, language } = this.registerForm.value;

    const res = await this.authService.register(
      nombre!, apellido!, email!, password!, language!
    );

    if (res.success) {
      this.showToast('Registro exitoso');
      // Redirigir auto al login después de registrarse
      this.router.navigate(['/login']);
    } else {
      this.showToast(this.firebaseErrorToMessage(res.message || ''));
    }
  }

  private firebaseErrorToMessage(error: string): string {
    switch (error) {
      case 'Firebase: Error (auth/email-already-in-use).':
        return 'El correo ya está registrado.';
      case 'Firebase: Error (auth/invalid-email).':
        return 'Correo inválido.';
      case 'Firebase: Error (auth/weak-password).':
        return 'La contraseña es muy débil.';
      default:
        return 'Ocurrió un error, intenta de nuevo.';
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

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
