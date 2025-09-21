
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import {
  IonContent, IonItem, IonLabel, IonInput, IonButton,
  IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonNote, IonGrid, IonRow, IonCol, IonIcon
} from '@ionic/angular/standalone';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-updateprofile',
  templateUrl: './updateprofile.page.html',
  styleUrls: ['./updateprofile.page.scss'],
  standalone: true,
  imports: [
    IonContent, CommonModule, FormsModule, ReactiveFormsModule,
    IonItem, IonLabel, IonInput, IonButton,
    IonCard, IonCardContent, IonCardHeader, IonCardTitle,
    IonNote, IonGrid, IonRow, IonCol, IonIcon
  ],
})
export class UpdateProfilePage implements OnInit {
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  profileForm = this.fb.group({
    name: ['', [Validators.minLength(2)]],
    lastname: ['', [Validators.minLength(2)]],
    email: ['', [Validators.email]],
    password: ['', [Validators.minLength(6)]],
  });

  ngOnInit() {
    console.log('UpdateProfilePage initialized');
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
        const res = await this.authService.updateProfile(updatedData);
        if (res.success) {
          console.log('Profile updated successfully');
          this.router.navigate(['/home']);
        } else {
          console.error('Error updating profile:', res.message);
        }
      } else {
        console.log('No fields to update');
      }
    } else {
      console.log('Form is invalid');
      this.profileForm.markAllAsTouched();
    }
  }
}
