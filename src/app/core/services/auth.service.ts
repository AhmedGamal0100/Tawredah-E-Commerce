import { inject, Injectable } from '@angular/core';
import { Auth, AuthErrorCodes, createUserWithEmailAndPassword, FacebookAuthProvider, GoogleAuthProvider, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut } from '@angular/fire/auth';
import { IUser } from '../models/user';
import { UsersService } from './user.service';
import { LoginStore } from '../store/login.store';
// import { UserStore } from '../store/user.store';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _auth = inject(Auth);
  private _googleAuthProvider = new GoogleAuthProvider();
  private _facebookAuthProvider = new FacebookAuthProvider();
  private _usersService = inject(UsersService);
  private _loginStore = inject(LoginStore)
  // private _userStore = inject(UserStore);

  async login(email: string, password: string) {
    return signInWithEmailAndPassword(this._auth, email, password)
  }

  // Firebase Register Method
  async register(email: string, password: string) {
    return createUserWithEmailAndPassword(this._auth, email, password)
  }

  // Firebase Verify Email Method
  sendEmailForVerification(user: any) {
    return sendEmailVerification(user);
  }

  // Firebase Logout Method
  async logout() {
    this._loginStore.setEmail("");
    return signOut(this._auth)
  }

  // Firebase Forgot Password Method
  async forgotPassword(email: string) {
    return sendPasswordResetEmail(this._auth, email)
  }

  // Firebase Google Login Method
  signInWithGoogle() {
    return signInWithPopup(this._auth, this._googleAuthProvider)
      .then((response) => {
        const user = response.user;
        const userData: IUser = {
          id: user.uid,
          firstName: user.displayName?.split(' ')[0] || '',
          lastName: user.displayName?.split(' ')[1] || '',
          businessName: user.displayName || '',
          email: user.email || '',
          businessPhoneNumber: user.phoneNumber || '',
          personalPhoneNumber: user.phoneNumber || '',
          addresses: [
            {
              id: '',
              government: '',
              city: '',
              street: '',
              building: ''
            }
          ],

          paymentMethods: [{
            id: '',
            cardNumber: '',
            expiryDate: '',
            securityCode: '',
          }],
          avatarUrl: user.photoURL || '',
          role: 'user',
          subscribe: false,
          // products: []
        };

        this._usersService.list({ role: "user" }).then(res => {
          if (!res.items.some(u => u.email === userData.email)) {
            this._usersService.create(userData);
            this._loginStore.setEmail(userData.email)
            localStorage.setItem("email", userData.email)
            
          } else {
            this._loginStore.setEmail(userData.email)
            localStorage.setItem("email", userData.email)
          }
        })
      })
      .catch(error => {
        console.error('Error signing in with Google:', error);
      });
  }

  // Firebase Facebook Login Method
  signInWithFacebook() {
    signInWithPopup(this._auth, this._facebookAuthProvider)
      .then((response) => {
      })
      .catch(error => {
        console.error('Error signing in with Google:', error);
      });
  }
}
