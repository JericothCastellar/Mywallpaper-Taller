import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { firebaseAuth, firebaseDb } from '../firebase.init';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  User as FirebaseUser
} from 'firebase/auth';
import { setDoc, doc, updateDoc } from 'firebase/firestore';

export interface AppUser {
  uid: string;
  email: string | null;
  displayName?: string | null;
  language?: string | null;
}

export interface AuthResult {
  success: boolean;
  code?: string;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<AppUser | null>(null);
  user$ = this.userSubject.asObservable();

  constructor() {
    onAuthStateChanged(firebaseAuth, (fbUser) => {
      if (fbUser) {
        const appUser: AppUser = {
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName,
        };
        this.userSubject.next(appUser);
      } else {
        this.userSubject.next(null);
      }
    });
  }

  getCurrentUser() {
    return this.userSubject.getValue();
  }

  async register(nombre: string, apellido: string, email: string, password: string, language: string): Promise<AuthResult> {
    try {
      const cred = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      const fbUser = cred.user;
      const fullName = `${nombre} ${apellido}`;

      await updateProfile(firebaseAuth.currentUser as FirebaseUser, { displayName: fullName });

      const userDocRef = doc(firebaseDb, 'users', fbUser.uid);
      await setDoc(userDocRef, {
        uid: fbUser.uid,
        email: fbUser.email,
        nombre,
        apellido,
        fullName,
        language,
        createdAt: new Date().toISOString()
      });

      return { success: true };
    } catch (error: any) {
      return { success: false, code: error.code, message: error.message || error.toString() };
    }
  }

  async login(email: string, password: string): Promise<AuthResult> {
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
      return { success: true };
    } catch (error: any) {
      return { success: false, code: error.code, message: error.message || error.toString() };
    }
  }

  async logout(): Promise<AuthResult> {
    try {
      await signOut(firebaseAuth);
      return { success: true };
    } catch (error: any) {
      return { success: false, code: error.code, message: error.message || error.toString() };
    }
  }

  async updateProfile(formData: { name?: string; lastname?: string; email?: string; password?: string; language?: string }, currentPassword?: string): Promise<AuthResult> {
    try {
      const user = firebaseAuth.currentUser;
      if (!user) throw new Error('No user logged in');

      if ((formData.email || formData.password) && currentPassword) {
        const credential = EmailAuthProvider.credential(user.email!, currentPassword);
        await reauthenticateWithCredential(user, credential);
      }

      if (formData.email) await updateEmail(user, formData.email);
      if (formData.password) await updatePassword(user, formData.password);

      if (formData.name || formData.lastname) {
        const fullName = `${formData.name || ''} ${formData.lastname || ''}`.trim();
        if (fullName) await updateProfile(user, { displayName: fullName });
      }

      const userDocRef = doc(firebaseDb, 'users', user.uid);
      const updateData: any = {};
      if (formData.name) updateData.nombre = formData.name;
      if (formData.lastname) updateData.apellido = formData.lastname;
      if (formData.email) updateData.email = formData.email;
      if (formData.language) updateData.language = formData.language;

      if (Object.keys(updateData).length > 0) {
        await updateDoc(userDocRef, updateData);
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, code: error.code, message: error.message || error.toString() };
    }
  }
}
