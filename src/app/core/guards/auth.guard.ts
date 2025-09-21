
import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return new Promise<boolean>((resolve) => {
    
    auth.user$.pipe(take(1)).subscribe(user => {
      if (user) {
        resolve(true);
      } else {
        router.navigate(['/login'], { replaceUrl: true });
        resolve(false);
      }
    });
  });
};
