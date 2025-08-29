import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LoginStore } from '../store/login.store';

export const roleActivatedGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const loginStore = inject(LoginStore);
    const router = inject(Router);

    const account = loginStore.loggedAccount();
    if (!account) {
        // Not logged in → redirect to login page
        router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }

    const allowedRoles = route.data['roles'] as string[];
    if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(account.role)) {
        // Logged in but not allowed → redirect to not-authorized
        router.navigate(['/not-authorized']);
        return false;
    }

    return true;
};
