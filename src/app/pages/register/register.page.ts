import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonButton, IonNote, IonCard,
  IonCardContent, IonCardHeader, IonCardTitle, IonSelect, IonSelectOption } from '@ionic/angular/standalone';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ReactiveFormsModule, 
    IonItem, IonLabel, IonInput, IonButton, IonNote, IonCard, IonCardContent, IonCardHeader, 
    IonCardTitle, IonSelect, IonSelectOption
  ],
})
export class RegisterPage implements OnInit {
  constructor(private fb: FormBuilder) {}

  registerForm = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    apellido: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    language: ['Espanol', Validators.required]
  });

  ngOnInit() {
    console.log('RegisterPage inicializada');
  }

  onSubmit() {
    if (this.registerForm.valid) {
      console.log('DATOS CORRECTOS:', this.registerForm.value);
    } else {
      console.log('DATOS INCORRECTOS');
      this.registerForm.markAllAsTouched();
    }
  }
}
