

import {
  getAuth,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  NextOrObserver,
  User,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  GithubAuthProvider
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getFirebaseConfig } from './firebase-config';

 export const app = initializeApp(getFirebaseConfig());
const auth = getAuth(app);

export const signInUser = async (
  email: string, 
  password: string
) => {
  if (!email && !password) return;

  return await signInWithEmailAndPassword(auth, email, password)
}
export const signUpUser = async (
    email: string, 
    password: string
  ) => {
    if (!email && !password) return;
  
    return await createUserWithEmailAndPassword(auth, email, password)
  }

const GoogleProvider = new GoogleAuthProvider();
const GithubProvider = new GithubAuthProvider();

export const GoogleAuth=async()=>{
     return await signInWithPopup(auth, GoogleProvider);
}
export const GithubAuth=async()=>{
  return await signInWithPopup(auth, GithubProvider);
}


export const userStateListener = (callback:NextOrObserver<User>) => {
  return onAuthStateChanged(auth, callback)
}

export const SignOutUser = async () => await signOut(auth);

