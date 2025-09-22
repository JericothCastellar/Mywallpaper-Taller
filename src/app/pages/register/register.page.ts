import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonButton,
  IonNote, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonSelect, IonSelectOption
} from '@ionic/angular/standalone';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { I18nService } from '../../core/services/i18n.service';
import { ToastService } from '../../core/services/toast.service';
import { LoadingService } from '../../core/services/loading.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ReactiveFormsModule,
    IonItem, IonLabel, IonInput, IonButton, IonNote, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
    IonSelect, IonSelectOption, RouterModule
  ],
})
export class RegisterPage implements OnInit {

  registerForm = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    apellido: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    language: ['es', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    public i18n: I18nService,
    private toast: ToastService,
    private loading: LoadingService
  ) {}

  ngOnInit() {}

  async onSubmit() {
    if (!this.registerForm.valid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { nombre, apellido, email, password, language } = this.registerForm.value;

    await this.loading.show(this.i18n.translate('REGISTER.BUTTON') || 'Registrando...');
    const res = await this.authService.register(nombre!, apellido!, email!, password!, language!);
    await this.loading.hide();

    if (res.success) {
      this.toast.show(this.i18n.translate('REGISTER.SUCCESS') || 'Registro exitoso');
      this.router.navigate(['/login']);
    } else {
      this.toast.show(
        this.firebaseErrorToMessage(res.message || this.i18n.translate('REGISTER.ERROR') || 'Error al registrar'),
        2500,
        'danger'
      );
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
        return this.i18n.translate('REGISTER.ERROR') || 'Ocurrió un error, intenta de nuevo.';
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
