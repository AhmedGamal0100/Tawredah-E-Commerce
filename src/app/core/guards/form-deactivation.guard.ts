import { CanDeactivateFn } from '@angular/router';

export const formDeactivationGuard: CanDeactivateFn<any> =
  (component) => {
  if (component && component.registerForm && component.registerForm.valid) {
    return true;
  } else if (component && component.canDeActivate()) {
    return new Promise<boolean>(resolve => {
      component.showConfirm(resolve);
    });
  }
  return true;
};