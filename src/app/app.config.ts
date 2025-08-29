import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { providePrimeNG } from 'primeng/config';
import { definePreset } from '@primeuix/themes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
// import { provideTranslateService, provideTranslateLoader } from "@ngx-translate/core";
// import { provideTranslateHttpLoader } from "@ngx-translate/http-loader";
import { provideHttpClient } from '@angular/common/http';

import Material from '@primeuix/themes/material';
import { provideStore } from '@ngrx/store';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { ReactiveFormsModule } from '@angular/forms';


export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    provideAnimationsAsync(),
    // provideTranslateService({
    //   loader: provideTranslateHttpLoader({
    //     prefix: '/assets/i18n/',
    //     suffix: '.json'
    //   }),
    //   fallbackLang: 'ar',
    //   lang: 'ar'
    // }),
    provideRouter(routes, withComponentInputBinding()),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'iti-grad-backend',
        appId: '1:1083139350432:web:b6d9b45bb5ea5819b24ec5',
        storageBucket: 'iti-grad-backend.firebasestorage.app',
        apiKey: 'AIzaSyDSV5bns1QhKj2PAVSCEU5eHs2cdkvQ5NM',
        authDomain: 'iti-grad-backend.firebaseapp.com',
        messagingSenderId: '1083139350432',
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    providePrimeNG({
      theme: {
        preset: definePreset(Material, {
          semantic: {
            colorScheme: {
              light: {
                primary: {
                  color: '#1A73E8',
                  inverseColor: '#fff',
                  hoverColor: '#1558B0',
                  activeColor: '#1558B0',
                },
              },
              dark: {
                surface: {
                  color: '#1E1E1E',
                  hoverColor: '#2A2A2A',
                  activeColor: '#333333',
                },
                primary: {
                  color: '#1A73E8',
                  hoverColor: '#1558B0',
                  activeColor: '#1558B0',
                },
              },
            },
          },
        }),
        options: {
          darkModeSelector: '.my-add-dark',
        },
      },
    }),
    provideStore(),
    provideStorage(() => getStorage()),
    provideAnimationsAsync(),
    ReactiveFormsModule,
  ],
};
