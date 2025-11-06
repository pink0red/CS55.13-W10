// Import function to generate fake data for starships and reviews
import { generateFakeStarshipsAndReviews } from "@/src/lib/fakeStarships.js";

// Import Firestore functions for querying and manipulating data
import {
  collection,
  onSnapshot,
  query,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  orderBy,
  Timestamp,
  runTransaction,
  where,
  addDoc,
  getFirestore,
} from "firebase/firestore";

// Import the initialized Firestore instance from the client app
import { db } from "@/src/lib/firebase/clientApp";

// Updates the `photo` field of a specific starship document.
export async function updateStarshipImageReference(
  starshipId,
  publicImageUrl
) {
  const starshipRef = doc(collection(db, "starships"), starshipId);
  if (starshipRef) {
    await updateDoc(starshipRef, { photo: publicImageUrl });
  }
}

// Function for updating starship rating
const updateWithRating = async (
  transaction,
  docRef,
  newRatingDocument,
  review
) => {
  const starship = await transaction.get(docRef);
  const data = starship.data();
  const newNumRatings = data?.numRatings ? data.numRatings + 1 : 1;
  const newSumRating = (data?.sumRating || 0) + Number(review.rating);
  const newAverage = newSumRating / newNumRatings;

  transaction.update(docRef, {
    numRatings: newNumRatings,
    sumRating: newSumRating,
    avgRating: newAverage,
  });

  transaction.set(newRatingDocument, {
    ...review,
    timestamp: Timestamp.fromDate(new Date()),
  });
};


// Add a review to a starship
export async function addReviewToStarship(db, starshipId, review) {
        if (!starshipId) {
                throw new Error("No starship ID has been provided.");
        }

        if (!review) {
                throw new Error("A valid review has not been provided.");
        }

        try {
                const docRef = doc(collection(db, "starships"), starshipId);
                const newRatingDocument = doc(
                        collection(db, `starships/${starshipId}/ratings`)
                );

                // corrected line
                await runTransaction(db, transaction =>
                        updateWithRating(transaction, docRef, newRatingDocument, review)
                );
        } catch (error) {
                console.error(
                        "There was an error adding the rating to the starship",
                        error
                );
                throw error;
        }
}


// Applies Firestore query filters based on user-selected search params.
function applyQueryFilters(q, { shipclass, manufacturer, price, sort }) {
  if (shipclass) {
    q = query(q, where("shipclass", "==", shipclass));
  }
  if (manufacturer) {
    q = query(q, where("manufacturer", "==", manufacturer));
  }
  if (price) {
    q = query(q, where("price", "==", price.length));
  }
  // Sort either by average rating or number of reviews
  if (sort === "Rating" || !sort) {
    q = query(q, orderBy("avgRating", "desc"));
  } else if (sort === "Review") {
    q = query(q, orderBy("numRatings", "desc"));
  }
  return q;
}

// Fetches all starships from Firestore, applying filters if provided.
export async function getStarships(db = db, filters = {}) {
  let q = query(collection(db, "starships"));

  q = applyQueryFilters(q, filters);
  const results = await getDocs(q);
  return results.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data(),
      // Only plain objects can be passed to Client Components from Server Components
      timestamp: doc.data().timestamp.toDate(),
    };
  });
}

// Subscribes to real-time updates on the starships collection.
export function getStarshipsSnapshot(cb, filters = {}) {
  if (typeof cb !== "function") {
    console.log("Error: The callback parameter is not a function");
    return;
  }

  let q = query(collection(db, "starships"));
  q = applyQueryFilters(q, filters);

  return onSnapshot(q, (querySnapshot) => {
    const results = querySnapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
        // Only plain objects can be passed to Client Components from Server Components
        timestamp: doc.data().timestamp.toDate(),
      };
    });

    cb(results);
  });
}

// Fetches a single starship document by ID.
export async function getStarshipById(db, starshipId) {
  if (!starshipId) {
    console.log("Error: Invalid ID received: ", starshipId);
    return;
  }
  const docRef = doc(db, "starships", starshipId);
  const docSnap = await getDoc(docRef);
  return {
    ...docSnap.data(),
    timestamp: docSnap.data().timestamp.toDate(),
  };
}

// Placeholder for real-time snapshot of a single starship document.
export function getStarshipSnapshotById(starshipId, cb) {
  return;
}

// Fetches all reviews (ratings) for a specific starship.
export async function getReviewsByStarshipId(db, starshipId) {
  if (!starshipId) {
    console.log("Error: Invalid starshipId received: ", starshipId);
    return;
  }

  const q = query(
    collection(db, "starships", starshipId, "ratings"),
    orderBy("timestamp", "desc")
  );

  const results = await getDocs(q);
  return results.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data(),
      // Only plain objects can be passed to Client Components from Server Components
      timestamp: doc.data().timestamp.toDate(),
    };
  });
}

// Subscribes to real-time updates on reviews for a specific starship.
export function getReviewsSnapshotByStarshipId(starshipId, cb) {
  if (!starshipId) {
    console.log("Error: Invalid starshipId received: ", starshipId);
    return;
  }

  const q = query(
    collection(db, "starships", starshipId, "ratings"),
    orderBy("timestamp", "desc")
  );
  return onSnapshot(q, (querySnapshot) => {
    const results = querySnapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
        // Only plain objects can be passed to Client Components from Server Components
        timestamp: doc.data().timestamp.toDate(),
      };
    });
    cb(results);
  });
}

// Adds sample (fake) starships and their associated reviews to Firestore.
export async function addFakeStarshipsAndReviews() {
  const data = await generateFakeStarshipsAndReviews();
  for (const { starshipData, ratingsData } of data) {
    try {
      const docRef = await addDoc(
        collection(db, "starships"),
        starshipData
      );

      for (const ratingData of ratingsData) {
        await addDoc(
          collection(db, "starships", docRef.id, "ratings"),
          ratingData
        );
      }
    } catch (e) {
      console.log("There was an error adding the document");
      console.error("Error adding document: ", e);
    }
  }
}
