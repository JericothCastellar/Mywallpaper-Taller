import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonButton, IonNote, IonCard,
  IonCardContent,IonCardHeader, IonCardTitle
 } from '@ionic/angular/standalone';

import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';



@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ReactiveFormsModule, IonItem, IonLabel, 
    IonInput, IonButton, IonNote,IonCard, IonCardContent,IonCardHeader, IonCardTitle
  ],
})
export class LoginPage implements OnInit {
  constructor(private fb: FormBuilder) { }

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  ngOnInit() {
    console.log('🔹 LoginPage inicializada');
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('DATOS CORRECTOS:', this.loginForm.value);
    } else {
      console.log('DATOS INVALIDOS');
    }
  }
}
