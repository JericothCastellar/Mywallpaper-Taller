import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  current = 'es';

  translations: Record<string, any> = {
    es: {
      LOGIN: {
        TITLE: 'Iniciar sesión',
        EMAIL: 'Correo electrónico',
        INVALID_EMAIL: 'Ingresa un correo válido',
        PASSWORD: 'Contraseña',
        MIN_PASSWORD: 'La contraseña debe tener al menos 6 caracteres',
        BUTTON: 'Ingresar',
        SUCCESS: 'Inicio de sesión exitoso',
        ERROR: 'Ocurrió un error al iniciar sesión',
        NO_ACCOUNT: '¿No tienes cuenta?',
        CREATE_ACCOUNT: 'Crear cuenta',
        LANGUAGE: 'Idioma'
      },
      REGISTER: {
        TITLE: 'Registro',
        NAME: 'Nombre',
        NAME_MIN: 'El nombre debe tener al menos 2 caracteres',
        LASTNAME: 'Apellido',
        LASTNAME_MIN: 'El apellido debe tener al menos 2 caracteres',
        BUTTON: 'Registrarse',
        SUCCESS: 'Registro exitoso',
        EMAIL_ALREADY_IN_USE: 'El correo ya está registrado.',
        HAVE_ACCOUNT: '¿Ya tienes cuenta?',
        ERROR: 'Ocurrió un error al registrar'
      },
      HOME: {
        TITLE: 'Mis Wallpapers',
        ONLY_IMAGES: 'Solo se permiten imágenes',
        FILE_TOO_BIG: 'El archivo supera los 5 MB',
        UPLOAD_IN_PROGRESS: 'Subida en progreso',
        NOT_AUTH: 'Usuario no autenticado',
        UPLOADED: 'Wallpaper subido',
        ERROR_UPLOADING: 'Error subiendo',
        DELETED: 'Wallpaper eliminado',
        ERROR_DELETING: 'Error al eliminar',
        ERROR_LOGOUT: 'Error al cerrar sesión',
        LOGGED_OUT: 'Sesión cerrada correctamente',
        UPLOADING: 'Subiendo...',
        DELETING: 'Eliminando...',
        CLOSE: 'Cerrar'
      },
      PROFILE: {
        TITLE: 'Actualizar Perfil',
        SAVE: 'Guardar Cambios',
        BACK_HOME: 'Home',
        UPDATING: 'Actualizando perfil...',
        UPDATED: 'Perfil actualizado correctamente',
        ERROR_UPDATING: 'Error al actualizar perfil',
        NO_CHANGES: 'No hay cambios para guardar',
        INVALID_FORM: 'Formulario inválido'
      }
    },
    en: {
      LOGIN: {
        TITLE: 'Login',
        EMAIL: 'Email',
        INVALID_EMAIL: 'Enter a valid email',
        PASSWORD: 'Password',
        MIN_PASSWORD: 'Password must be at least 6 characters',
        BUTTON: 'Sign In',
        SUCCESS: 'Login successful',
        ERROR: 'An error occurred during login',
        NO_ACCOUNT: "Don't have an account?",
        CREATE_ACCOUNT: 'Create account',
        LANGUAGE: 'Language'
      },
      REGISTER: {
        TITLE: 'Register',
        NAME: 'First Name',
        NAME_MIN: 'First name must be at least 2 characters',
        LASTNAME: 'Last Name',
        LASTNAME_MIN: 'Last name must be at least 2 characters',
        BUTTON: 'Register',
        SUCCESS: 'Registration successful',
        EMAIL_ALREADY_IN_USE: 'Email already in use.',
        HAVE_ACCOUNT: 'Already have an account?',
        ERROR: 'An error occurred during registration'
      },
      HOME: {
        TITLE: 'My Wallpapers',
        ONLY_IMAGES: 'Only images are allowed',
        FILE_TOO_BIG: 'File exceeds 5 MB',
        UPLOAD_IN_PROGRESS: 'Upload in progress',
        NOT_AUTH: 'User not authenticated',
        UPLOADED: 'Wallpaper uploaded',
        ERROR_UPLOADING: 'Error uploading',
        DELETED: 'Wallpaper deleted',
        ERROR_DELETING: 'Error deleting',
        ERROR_LOGOUT: 'Error logging out',
        LOGGED_OUT: 'Logged out successfully',
        UPLOADING: 'Uploading...',
        DELETING: 'Deleting...',
        CLOSE: 'Close'
      },
      PROFILE: {
        TITLE: 'Update Profile',
        SAVE: 'Save Changes',
        BACK_HOME: 'Home',
        UPDATING: 'Updating profile...',
        UPDATED: 'Profile updated successfully',
        ERROR_UPDATING: 'Error updating profile',
        NO_CHANGES: 'No changes to save',
        INVALID_FORM: 'Invalid form'
      }
    }
  };

  init() {
    const saved = localStorage.getItem('lang');
    if (saved) {
      this.current = saved;
      return;
    }
    const navLang = navigator.language || (navigator as any).userLanguage || 'en';
    const lang = navLang.toLowerCase().startsWith('es') ? 'es' : 'en';
    this.current = lang;
    localStorage.setItem('lang', lang);
  }

  setLang(lang: string) {
    if (lang !== 'es' && lang !== 'en') lang = 'en';
    this.current = lang;
    localStorage.setItem('lang', lang);
  }

  translate(key: string): string {
    if (!key) return '';
    const parts = key.split('.');
    let node = this.translations[this.current];
    for (const p of parts) {
      if (node && p in node) {
        node = node[p];
      } else {
        return key;
      }
    }
    return typeof node === 'string' ? node : key;
  }
}
