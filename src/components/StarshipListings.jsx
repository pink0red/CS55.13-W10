"use client";

// This components handles the starship listings page
// It receives data from src/app/page.jsx, such as the initial starships and search params from the URL

import Link from "next/link";
import { React, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import renderStars from "@/src/components/Stars.jsx";
import { getStarshipsSnapshot } from "@/src/lib/firebase/firestore.js";
import Filters from "@/src/components/Filters.jsx";

const StarshipItem = ({ starship }) => (
  <li key={starship.id} className="card">
    <Link href={`/starship/${starship.id}`}>
      <div className="card__image">
        <img src={starship.photo} alt={starship.name} />
      </div>
      <div className="card__body">
        <h2>{starship.name}</h2>
        <StarshipRating starship={starship} />
        <StarshipMetadata starship={starship} />
      </div>
    </Link>
  </li>
);

const StarshipRating = ({ starship }) => (
  <div className="restaurant__rating">
    <ul>{renderStars(starship.avgRating)}</ul>
    <span>({starship.numRatings})</span>
  </div>
);

const StarshipMetadata = ({ starship }) => (
  <div className="restaurant__meta">
    <p>
      {starship.category} | {starship.city}
    </p>
    <p>{"₡".repeat(starship.price)}</p>
  </div>
);

export default function StarshipListings({
  initialStarships,
  searchParams,
}) {
  const router = useRouter();

  // The initial filters are the search params from the URL, useful for when the user refreshes the page
  const initialFilters = {
    city: searchParams.city || "",
    category: searchParams.category || "",
    price: searchParams.price || "",
    sort: searchParams.sort || "",
  };

  const [starships, setStarships] = useState(initialStarships);
  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    routerWithFilters(router, filters);
  }, [router, filters]);

  useEffect(() => {
    return getStarshipsSnapshot((data) => {
      setStarships(data);
    }, filters);
  }, [filters]);

  return (
    <article>
      <Filters filters={filters} setFilters={setFilters} />
      <ul className="restaurants">
        {starships.map((starship) => (
          <StarshipItem key={starship.id} starship={starship} />
        ))}
      </ul>
    </article>
  );
}

function routerWithFilters(router, filters) {
  const queryParams = new URLSearchParams();

  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== "") {
      queryParams.append(key, value);
    }
  }

  const queryString = queryParams.toString();
  router.push(`?${queryString}`);
}

