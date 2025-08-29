import { effect, inject } from '@angular/core';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';

export const TemplateStore = signalStore(
    { providedIn: 'root' },
    withState(() => {

    }),

    withMethods(() => {
        return {

        };
    }),

    withHooks({
        onInit() {
            effect(() => {

            })
        },

        onDestroy() { }
    })
);

