import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { firebaseAuth, firebaseDb } from '../firebase.init';
import {
  User,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  updateEmail
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor() {
    onAuthStateChanged(firebaseAuth, user => {
      this.userSubject.next(user);
    });
  }

  getCurrentUser(): User | null {
    return this.userSubject.value;
  }

  async login(email: string, password: string): Promise<{ success: boolean; message?: string }> {
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  }

  async register(nombre: string, apellido: string, email: string, password: string, language: string): Promise<{ success: boolean; message?: string }> {
    try {
      const { user } = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      await updateProfile(user, { displayName: `${nombre} ${apellido}` });
      this.userSubject.next(user);
      await setDoc(doc(firebaseDb, 'users', user.uid), { nombre, apellido, email, language });
      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  }

  async logout(): Promise<{ success: boolean; message?: string }> {
    try {
      await signOut(firebaseAuth);
      this.userSubject.next(null);
      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  }

  async updateProfile(data: { name?: string; lastname?: string; email?: string }): Promise<{ success: boolean; message?: string }> {
    try {
      const user = this.getCurrentUser();
      if (!user) return { success: false, message: 'No hay usuario logueado' };
      if (data.name || data.lastname) {
        await updateProfile(user, { displayName: `${data.name || ''} ${data.lastname || ''}`.trim() });
      }
      if (data.email) {
        await updateEmail(user, data.email);
      }
      this.userSubject.next(user);
      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  }
}
