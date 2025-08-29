import { effect, inject } from '@angular/core';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { UsersService } from '../services/user.service';
import { IUser } from '../models/user';
// import { UserStore } from './user.store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'; // For cleanup


const loggedAcc: IUser | null = null;
export const LoginStore = signalStore(
    { providedIn: 'root' },
    withState<{
        loggedAccount: IUser | null,
        isLogin: boolean,
        email: string
    }>({
        loggedAccount: loggedAcc,
        isLogin: false,
        email: ''
    }),

    withMethods((state) => {
        const userService = inject(UsersService)
        return {

            async getLoggedAccount(email: string) {
                userService.getUserByEmail(email).then(res => {
                    if (res) {
                        patchState(state, { loggedAccount: res });
                        return;
                    }
                })

            },
            setLoggedAccount(user: IUser) {
                patchState(state, { loggedAccount: user })
            },

            setLogIn() {
                patchState(state, {
                    isLogin: true
                })
            },

            setLogOut() {
                patchState(state, {
                    isLogin: false,

                    loggedAccount: null,
                })
            },

            setEmail(email: string) {
                patchState(state, {
                    email
                })
            },
        };
    }),

    withHooks({
        onInit(state) {
            const userService = inject(UsersService);
            const destroy$ = takeUntilDestroyed();
            const emailLocalStorage = localStorage.getItem('email');

            effect(() => {
                const currentEmail = state.email() || emailLocalStorage;
                if (currentEmail) {
                    userService.getUserByEmail(currentEmail).then(res => {
                        if (res) {
                            userService.get$(res.id)
                                .pipe(destroy$)
                                .subscribe(updatedUser => {
                                    patchState(state, { loggedAccount: updatedUser as IUser });
                                });
                            patchState(state, { isLogin: true });
                        }
                    });
                }
            });
        },

        onDestroy() {
            console.log("Logged out from Store");

        }
    })
);

