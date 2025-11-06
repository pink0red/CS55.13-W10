// This directive tells Next.js this component uses client-side features like hooks or browser APIs
"use client";

// Import React and useEffect hook for side-effects in functional components
import React, { useEffect } from "react";

// Import the Link component from Next.js for client-side navigation
import Link from "next/link";

// Import Firebase authentication helper functions
import {
  signInWithGoogle, // Function to initiate Google Sign-In
  signOut,          // Function to sign the user out
  onIdTokenChanged, // Firebase listener for changes in the ID token (i.e., login/logout events)
} from "@/src/lib/firebase/auth.js";

// Import Firestore function to populate database with fake data
import { addFakeStarshipsAndReviews } from "@/src/lib/firebase/firestore.js";

// Import cookie helper functions to manage session cookies
import { setCookie, deleteCookie } from "cookies-next";

// Custom hook to handle user session tracking and token management
function useUserSession(initialUser) {

  // useEffect runs after the component mounts
  useEffect(() => {
    // If user is logged in, get their token and store it in a cookie
    return onIdTokenChanged(async (user) => {
      if (user) {
        const idToken = await user.getIdToken();
        await setCookie("__session", idToken);  // Set a secure session cookie
      } else {
        await deleteCookie("__session");  // If user logged out, remove the session cookie
      }
      // If the current user hasn't changed, don't reload the page
      if (initialUser?.uid === user?.uid) {
        return;
      }

      // Reload the page to reflect auth state change (login/logout)
      window.location.reload();
    });
  }, [initialUser]);  // Re-run this effect only if `initialUser` changes

  return initialUser;   // Return the current user (may be `null`)
}

// Main Header component, receives initialUser as prop
export default function Header({ initialUser }) {

  // Use the custom hook to get current user and track auth changes
  const user = useUserSession(initialUser);

  // Sign out click handler
  const handleSignOut = (event) => {  // Prevent default link behavior
    event.preventDefault(); // Call Firebase signOut
    signOut();
  };

  // Sign in click handler
  const handleSignIn = (event) => {
    event.preventDefault();
    signInWithGoogle();
  };

  // JSX returned by this component
  return (
    <header>
      <Link href="/" className="logo">
        <img src="/starship-registry.svg" alt="StarshipRegistry" />
        Starship Registry
      </Link>
      {user ? (
        <>
          <div className="profile">
            <p>
              <img
                className="profileImage"
                src={user.photoURL || "/profile.svg"}
                alt={user.email}
              />
              {user.displayName}
            </p>

            <div className="menu">
              ...
              <ul>
                <li>{user.displayName}</li>

                <li>
                  <a href="#" onClick={addFakeStarshipsAndReviews}>
                    Add sample starships
                  </a>
                </li>

                <li>
                  <a href="#" onClick={handleSignOut}>
                    Sign Out
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </>
      ) : (

        // If user is not signed in, show Sign-In link
        <div className="profile">
          <a href="#" onClick={handleSignIn}>
            <img src="/profile.svg" alt="A placeholder user image" />
            Sign In with Google
          </a>
        </div>
      )}
    </header>
  );
}
