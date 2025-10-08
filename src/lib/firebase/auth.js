// Import necessary Firebase Authentication functions and classes
import {
  GoogleAuthProvider, // Class used to authenticate with Google
  signInWithPopup,    // Function to sign in using a popup window
  onAuthStateChanged as _onAuthStateChanged,  // Listener for changes in overall auth state (login/logout)
  onIdTokenChanged as _onIdTokenChanged,      // Listener for changes in ID token (token refresh or user change)
} from "firebase/auth";

// Import the Firebase `auth` instance initialized in the client app
import { auth } from "@/src/lib/firebase/clientApp";

// Wrapper function to observe changes in authentication state (login/logout)
// Calls the callback `cb` when auth state changes
export function onAuthStateChanged(cb) {
  return _onAuthStateChanged(auth, cb);
}

// Wrapper function to observe changes in ID token
// Useful for detecting token refreshes or subtle user changes
export function onIdTokenChanged(cb) {
  return _onIdTokenChanged(auth, cb);
}

// Function to initiate Google Sign-In using a popup
export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();

  try {
    await signInWithPopup(auth, provider);  // Open a popup and attempt to sign in the user
  } catch (error) {
    console.error("Error signing in with Google", error); // Handle and log errors if sign-in fails
  }
}

// Function to sign the user out of Firebase
export async function signOut() {
  try {
    return auth.signOut();  // Call Firebase's signOut method
  } catch (error) {
    console.error("Error signing out with Google", error);
  }
}