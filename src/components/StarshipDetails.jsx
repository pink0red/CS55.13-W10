// This component shows starship metadata, and offers some actions to the user like uploading a new starship image, and adding a review.

import React from "react";
import renderStars from "@/src/components/Stars.jsx";

const StarshipDetails = ({
  starship,
  userId,
  handleStarshipImage,
  setIsOpen,
  isOpen,
  children,
}) => {
  return (
    <section className="hero">
      <img className="hero__image" src={starship.photo} alt={starship.name} />
      <div className="hero__overlay"></div>

      

      <div className="details__container">
        <div className="details">
          <h2>{starship.name}</h2>

          <div className="starship__rating">
            <ul>{renderStars(starship.avgRating)}</ul>

            <span>({starship.numRatings})</span>
          </div>

          <p>
            {starship.shipclass} | {starship.manufacturer}
          </p>
          <p>{"₡".repeat(starship.price)}</p>
          {children}
        </div>
      </div>

      <div className="actions">
        {userId && (
          <img
            alt="review"
            className="review"
            onClick={() => {
              setIsOpen(!isOpen);
            }}
            src="/review.svg"
          />
        )}
        <label
          onChange={(event) => handleStarshipImage(event.target)}
          htmlFor="upload-image"
          className="add"
        >
          <input
            name=""
            type="file"
            id="upload-image"
            className="file-input hidden w-full h-full"
          />

          <img className="add-image" src="/add.svg" alt="Add image" />
        </label>
      </div>
    </section>
  );
};

export default StarshipDetails;

