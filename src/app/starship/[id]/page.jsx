import Starship from "@/src/components/Starship.jsx";
import { Suspense } from "react";
import { getStarshipById } from "@/src/lib/firebase/firestore.js";
import {
  getAuthenticatedAppForUser,
  getAuthenticatedAppForUser as getUser,
} from "@/src/lib/firebase/serverApp.js";
import ReviewsList, {
  ReviewsListSkeleton,
} from "@/src/components/Reviews/ReviewsList";
import {
  GeminiSummary,
  GeminiSummarySkeleton,
} from "@/src/components/Reviews/ReviewSummary";
import { getFirestore } from "firebase/firestore";

export default async function Home(props) {
  // This is a server component, we can access URL
  // parameters via Next.js and download the data
  // we need for this page
  const params = await props.params;
  const { currentUser } = await getUser();
  const { firebaseServerApp } = await getAuthenticatedAppForUser();
  const starship = await getStarshipById(
    getFirestore(firebaseServerApp),
    params.id
  );

  return (
    <main className="main__restaurant">
      <Starship
        id={params.id}
        initialStarship={starship}
        initialUserId={currentUser?.uid || ""}
      >
        <Suspense fallback={<GeminiSummarySkeleton />}>
          <GeminiSummary starshipId={params.id} />
        </Suspense>
      </Starship>
      <Suspense
        fallback={<ReviewsListSkeleton numReviews={starship.numRatings} />}
      >
        <ReviewsList starshipId={params.id} userId={currentUser?.uid || ""} />
      </Suspense>
    </main>
  );
}

