import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Capacitor } from '@capacitor/core';
import { firebaseAuth, firebaseDb } from '../firebase.init';
import {
  User as WebUser,
  onAuthStateChanged,
  signOut as webSignOut,
  signInWithEmailAndPassword as webSignIn,
  createUserWithEmailAndPassword as webCreateUser,
  updateProfile as webUpdateProfile,
  updateEmail as webUpdateEmail
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<WebUser | null>(null);
  user$ = this.userSubject.asObservable();
  private isNative = Capacitor.isNativePlatform();

  constructor() {
    if (!this.isNative) {
      onAuthStateChanged(firebaseAuth, user => {
        this.userSubject.next(user);
      });
    } else {
      FirebaseAuthentication.addListener('authStateChange', event => {
        this.userSubject.next(event.user as any);
      });
    }
  }

  async login(email: string, password: string) {
    if (this.isNative) {
      const res = await FirebaseAuthentication.signInWithEmailAndPassword({ email, password });
      this.userSubject.next(res.user as any);
      return { success: true, user: res.user };
    } else {
      const userCredential = await webSignIn(firebaseAuth, email, password);
      this.userSubject.next(userCredential.user);
      return { success: true, user: userCredential.user };
    }
  }

  async register(nombre: string, apellido: string, email: string, password: string, language: string) {
    if (this.isNative) {
      const { user } = await FirebaseAuthentication.createUserWithEmailAndPassword({ email, password });
      if (!user) throw new Error('No se pudo crear el usuario nativo');
      await setDoc(doc(firebaseDb, 'users', user.uid), {
        nombre,
        apellido,
        email,
        language
      });
      this.userSubject.next(user as any);
      return { success: true, user };
    } else {
      const { user } = await webCreateUser(firebaseAuth, email, password);
      await webUpdateProfile(user, { displayName: `${nombre} ${apellido}` });
      await setDoc(doc(firebaseDb, 'users', user.uid), {
        nombre,
        apellido,
        email,
        language
      });
      this.userSubject.next(user);
      return { success: true, user };
    }
  }

  async updateProfile(data: { name?: string; lastname?: string; email?: string; password?: string }) {
    const user = this.userSubject.value;
    if (!user) throw new Error('No hay usuario autenticado');
    if (data.name || data.lastname) {
      const displayName = `${data.name || ''} ${data.lastname || ''}`.trim();
      await webUpdateProfile(user, { displayName });
    }
    if (data.email && data.email !== user.email) {
      await webUpdateEmail(user, data.email);
    }
    await setDoc(doc(firebaseDb, 'users', user.uid), {
      nombre: data.name,
      apellido: data.lastname,
      email: data.email || user.email
    }, { merge: true });
    this.userSubject.next(user);
    return { success: true };
  }

  async logout() {
    if (this.isNative) {
      await FirebaseAuthentication.signOut();
      this.userSubject.next(null);
    } else {
      await webSignOut(firebaseAuth);
      this.userSubject.next(null);
    }
    return { success: true };
  }

  get currentUser() {
    return this.userSubject.value;
  }
}
