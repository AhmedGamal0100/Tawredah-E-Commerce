import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginStore } from '../store/login.store';

export const redirectIfLoggedGuard: CanActivateFn = () => {
  const loginStore = inject(LoginStore);
  const router = inject(Router);

  const account = loginStore.loggedAccount();
  if (account) {
    if (account.role === 'factory') {
      router.navigate(['/supplier']);
      return false;
    }
  }

  return true; // Not logged in → allow access
};