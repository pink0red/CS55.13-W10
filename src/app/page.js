// Import the StarshipListings React component, which displays the list of starships
import StarshipListings from "@/src/components/StarshipListings.jsx";

// Import the getStarships function used to fetch starship data from Firestore
import { getStarships } from "@/src/lib/firebase/firestore.js";

// Import a utility to initialize a Firebase Admin SDK app for the currently authenticated user
import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";

// Import the getFirestore function to get a Firestore instance
import { getFirestore } from "firebase/firestore";

// Force next.js to treat this route as server-side rendered
// Without this line, during the build process, next.js will treat this route as static and build a static HTML file for it
export const dynamic = "force-dynamic";

// This line also forces this route to be server-side rendered
// export const revalidate = 0;
export default async function Home(props) {
  // Extract search parameters from props (provided by Next.js via the URL query string)
  const searchParams = await props.searchParams;
  // Using seachParams which Next.js provides, allows the filtering to happen on the server-side, for example:
  // ?manufacturer=London&shipclass=Indian&sort=Review
  const { firebaseServerApp } = await getAuthenticatedAppForUser();
  
  // Use the authenticated Firestore instance to fetch starships based on the searchParams
  const starships = await getStarships(
    getFirestore(firebaseServerApp),
    searchParams
  );

  // Render the main page content with the list of starships and search parameters
  return (
    <main className="main__home">
      <StarshipListings
        initialStarships={starships}
        searchParams={searchParams}
      />
    </main>
  );
}
