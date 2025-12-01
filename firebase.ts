// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCcfJ1vWqzwOjMQEVtB1teKiG9Q4lZiSeo',
  authDomain: 'social-chaos.firebaseapp.com',
  projectId: 'social-chaos',
  storageBucket: 'social-chaos.firebasestorage.app',
  messagingSenderId: '1039686261682',
  appId: '1:1039686261682:web:44fbb4302b47a21cf122ab',
  measurementId: 'G-G9QR6K1Z2E',
}

// Initialize Firebase (only once)
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

// Initialize Analytics only on client side (browser)
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null

export { app, analytics }
