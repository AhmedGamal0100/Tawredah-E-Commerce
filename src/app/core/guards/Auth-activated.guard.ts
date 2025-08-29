import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginStore } from '../store/login.store';

export const AuthActivatedGuard: CanActivateFn = () => {
  const loginStore = inject(LoginStore);
  const token = localStorage.getItem("token");
  const router = inject(Router);

  if (token === "true") {
    loginStore.setLogIn();
    return true;
  } else {
    loginStore.setLogOut();
    return router.createUrlTree(['/login'], {
      queryParams: { message: 'You must log-in first!' }
    });
    // return true;
  }
};
