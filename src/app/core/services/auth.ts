import { inject, Injectable } from '@angular/core';
import { Auth, AuthErrorCodes, createUserWithEmailAndPassword, FacebookAuthProvider, GoogleAuthProvider, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _auth = inject(Auth)
  private _googleAuthProvider = new GoogleAuthProvider()
  private _facebookAuthProvider = new FacebookAuthProvider()

  async login(email: string, password: string) {
    return signInWithEmailAndPassword(this._auth, email, password)
      .then(res => {
        console.log(res.user);

        if (res.user.emailVerified) {
          localStorage.setItem('token', 'true');
          alert("Login Successfully");
        } else {
          alert("Please verify your email before logging in.");
        }
      })
      .catch(err => {
        if (err instanceof Error) {
          if (err.message.includes(AuthErrorCodes.INVALID_EMAIL)) {
            return 'Invalid email address.';
          }
          else if (err.message.includes('Auth/invalid-credential')) {
            return 'Invalid Email or Password.';
          }
          else if (err.message.includes(AuthErrorCodes.WEAK_PASSWORD)) {
            return 'Password is too weak.';
          }
          else if (err.message.includes(AuthErrorCodes.EMAIL_EXISTS)) {
            return 'Email already exists.';
          }
          else {
            return 'An unexpected error occurred. Please try again later.';
          }
        }
        return 'Error signing in';
      });
  }

  // Firebase Register Method
  async register(email: string, password: string) {
    return createUserWithEmailAndPassword(this._auth, email, password)
      .then(res => {
        alert("Registration Successfully");
        this.sendEmailForVerification(res.user)
      })
      .catch(err => {
        alert(err.message);
      });
  }

  // Firebase Logout Method
  async logout() {
    return signOut(this._auth)
      .then(() => {
        alert("Logout Successfully");
        localStorage.removeItem('token');
        localStorage.removeItem('email');
      })
      .catch(err => {
        alert(err.message);
      });
  }

  // Firebase Forgot Password Method
  async forgotPassword(email: string) {
    return sendPasswordResetEmail(this._auth, email)
      .then(() => {
      })
      .catch(err => {
        alert(err.message);
      });
  }

  // Firebase Verify Email Method
  sendEmailForVerification(user: any) {
    return sendEmailVerification(user)
      .then(() => {
        alert("Verification email sent.");
      })
      .catch(err => {
        console.error("Email verification error:", err);
        alert("Something went wrong. Not able to send email to you.");
      });
  }

  // Firebase Google Login Method
  signInWithGoogle() {
    signInWithPopup(this._auth, this._googleAuthProvider)
      .then((response) => {
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
