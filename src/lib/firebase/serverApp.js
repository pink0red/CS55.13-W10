// enforces that this code can only be called on the server
// https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#keeping-server-only-code-out-of-the-client-environment
import "server-only";

import { cookies } from "next/headers";   // Import the `cookies` API from Next.js to access HTTP cookies on the server.
import { initializeServerApp, initializeApp } from "firebase/app";  // Import `initializeServerApp` (for SSR) and `initializeApp` (general Firebase app initialization)

import { getAuth } from "firebase/auth";  // Import Firebase Auth methods for server-side authentication

// Returns an authenticated client SDK instance for use in Server Side Rendering
// and Static Site Generation
export async function getAuthenticatedAppForUser() {
  const authIdToken = (await cookies()).get("__session")?.value;

  // Firebase Server App is a new feature in the JS SDK that allows you to
  // instantiate the SDK with credentials retrieved from the client & has
  // other affordances for use in server environments.
  const firebaseServerApp = initializeServerApp(
    // https://github.com/firebase/firebase-js-sdk/issues/8863#issuecomment-2751401913
    initializeApp(),
    {
      authIdToken,
    }
  );

  const auth = getAuth(firebaseServerApp);    // Retrieve the Auth instance from the server-side app
  await auth.authStateReady();    // Wait for Firebase Auth to finish processing the auth state (i.e., determine current user)

  return { firebaseServerApp, currentUser: auth.currentUser };
}
