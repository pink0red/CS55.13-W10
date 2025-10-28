"use client";

// This components shows one individual starship
// It receives data from src/app/starship/[id]/page.jsx

import { React, useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import { getStarshipSnapshotById } from "@/src/lib/firebase/firestore.js";
import { useUser } from "@/src/lib/getUser";
import StarshipDetails from "@/src/components/StarshipDetails.jsx";
import { updateStarshipImage } from "@/src/lib/firebase/storage.js";

const ReviewDialog = dynamic(() => import("@/src/components/ReviewDialog.jsx"));

export default function Starship({
  id,
  initialStarship,
  initialUserId,
  children,
}) {
  const [starshipDetails, setStarshipDetails] = useState(initialStarship);
  const [isOpen, setIsOpen] = useState(false);

  // The only reason this component needs to know the user ID is to associate a review with the user, and to know whether to show the review dialog
  const userId = useUser()?.uid || initialUserId;
  const [review, setReview] = useState({
    rating: 0,
    text: "",
  });

  const onChange = (value, name) => {
    setReview({ ...review, [name]: value });
  };

  async function handleStarshipImage(target) {
    const image = target.files ? target.files[0] : null;
    if (!image) {
      return;
    }

    const imageURL = await updateStarshipImage(id, image);
    setStarshipDetails({ ...starshipDetails, photo: imageURL });
  }

  const handleClose = () => {
    setIsOpen(false);
    setReview({ rating: 0, text: "" });
  };

  useEffect(() => {
    return getStarshipSnapshotById(id, (data) => {
      setStarshipDetails(data);
    });
  }, [id]);

  return (
    <>
      <StarshipDetails
        starship={starshipDetails}
        userId={userId}
        handleStarshipImage={handleStarshipImage}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
      >
        {children}
      </StarshipDetails>
      {userId && (
        <Suspense fallback={<p>Loading...</p>}>
          <ReviewDialog
            isOpen={isOpen}
            handleClose={handleClose}
            review={review}
            onChange={onChange}
            userId={userId}
            id={id}
          />
        </Suspense>
      )}
    </>
  );
}

