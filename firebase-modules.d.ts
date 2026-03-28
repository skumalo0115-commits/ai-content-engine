declare module "firebase/app" {
  export interface FirebaseOptions {
    apiKey?: string;
    authDomain?: string;
    projectId?: string;
    storageBucket?: string;
    messagingSenderId?: string;
    appId?: string;
  }

  export type FirebaseApp = object;

  export function getApps(): FirebaseApp[];
  export function getApp(name?: string): FirebaseApp;
  export function initializeApp(options: FirebaseOptions, name?: string): FirebaseApp;
}

declare module "firebase/auth" {
  import type { FirebaseApp } from "firebase/app";

  export type Persistence = object;

  export interface User {
    uid: string;
    email: string | null;
    displayName: string | null;
  }

  export interface Auth {
    currentUser: User | null;
  }

  export interface UserCredential {
    user: User;
  }

  export const browserLocalPersistence: Persistence;

  export class GoogleAuthProvider {
    setCustomParameters(parameters: Record<string, string>): void;
  }

  export function getAuth(app?: FirebaseApp): Auth;
  export function setPersistence(auth: Auth, persistence: Persistence): Promise<void>;
  export function onAuthStateChanged(auth: Auth, nextOrObserver: (user: User | null) => void): () => void;
  export function createUserWithEmailAndPassword(auth: Auth, email: string, password: string): Promise<UserCredential>;
  export function signInWithEmailAndPassword(auth: Auth, email: string, password: string): Promise<UserCredential>;
  export function signInWithPopup(auth: Auth, provider: GoogleAuthProvider): Promise<UserCredential>;
  export function signOut(auth: Auth): Promise<void>;
  export function updateProfile(user: User, profile: { displayName?: string | null; photoURL?: string | null }): Promise<void>;
}

declare module "firebase/firestore" {
  import type { FirebaseApp } from "firebase/app";

  export type Firestore = object;
  export interface DocumentData {
    [key: string]: unknown;
  }
  export interface SetOptions {
    merge?: boolean;
  }
  export interface DocumentReference {
    readonly id: string;
  }
  export interface DocumentSnapshot {
    exists(): boolean;
    data(): DocumentData | undefined;
  }

  export function getFirestore(app?: FirebaseApp): Firestore;
  export function doc(firestore: Firestore, path: string, ...pathSegments: string[]): DocumentReference;
  export function getDoc(reference: DocumentReference): Promise<DocumentSnapshot>;
  export function setDoc(reference: DocumentReference, data: DocumentData, options?: SetOptions): Promise<void>;
  export function onSnapshot(reference: DocumentReference, observer: (snapshot: DocumentSnapshot) => void): () => void;
}
