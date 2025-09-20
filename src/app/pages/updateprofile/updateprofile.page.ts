import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonButton,
  IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonNote, IonGrid, IonRow, IonCol, IonIcon
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-updateprofile',
  templateUrl: './updateprofile.page.html',
  styleUrls: ['./updateprofile.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ReactiveFormsModule,
    IonItem, IonLabel, IonInput, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
    IonNote, IonGrid, IonRow, IonCol, IonIcon
  ],
})
export class UpdateprofilePage implements OnInit {
  constructor(private fb: FormBuilder) {}

  profileForm = this.fb.group({
    name: ['', [Validators.minLength(2)]],
    lastname: ['', [Validators.minLength(2)]],
    email: ['', [Validators.email]],
    password: ['', [Validators.minLength(6)]],
  });

  ngOnInit() {
    console.log('UpdateprofilePage inicializada');
  }

  onSubmit() {
    if (this.profileForm.valid) {
      const formValues = this.profileForm.value as {
        name?: string | null;
        lastname?: string | null;
        email?: string | null;
        password?: string | null;
      };

      const updatedData: Partial<typeof formValues> = {};

      (Object.keys(formValues) as (keyof typeof formValues)[]).forEach((key) => {
        if (formValues[key]) {
          updatedData[key] = formValues[key];
        }
      });

      if (Object.keys(updatedData).length > 0) {
        console.log('Campos actualizados:', updatedData);
      } else {
        console.log('No se actualizaron campos');
      }
    } else {
      console.log('Formulario no valido');
      this.profileForm.markAllAsTouched();
    }
  }
}
