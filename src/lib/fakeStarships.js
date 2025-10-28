import {
  randomNumberBetween,
  getRandomDateAfter,
  getRandomDateBefore,
} from "@/src/lib/utils.js";
import { randomData } from "@/src/lib/randomData.js";

import { Timestamp } from "firebase/firestore";

export async function generateFakeStarshipsAndReviews() {
  const starshipsToAdd = 5;
  const data = [];

  for (let i = 0; i < starshipsToAdd; i++) {
    const starshipTimestamp = Timestamp.fromDate(getRandomDateBefore());

    const ratingsData = [];

    // Generate a random number of ratings/reviews for this starship
    for (let j = 0; j < randomNumberBetween(0, 5); j++) {
      const ratingTimestamp = Timestamp.fromDate(
        getRandomDateAfter(starshipTimestamp.toDate())
      );

      const ratingData = {
        rating:
          randomData.starshipReviews[
            randomNumberBetween(0, randomData.starshipReviews.length - 1)
          ].rating,
        text: randomData.starshipReviews[
          randomNumberBetween(0, randomData.starshipReviews.length - 1)
        ].text,
        userId: `User #${randomNumberBetween()}`,
        timestamp: ratingTimestamp,
      };

      ratingsData.push(ratingData);
    }

    const avgRating = ratingsData.length
      ? ratingsData.reduce(
          (accumulator, currentValue) => accumulator + currentValue.rating,
          0
        ) / ratingsData.length
      : 0;

    const starshipData = {
      category:
        randomData.starshipClasses[
          randomNumberBetween(0, randomData.starshipClasses.length - 1)
        ],
      name: randomData.starshipNames[
        randomNumberBetween(0, randomData.starshipNames.length - 1)
      ],
      avgRating,
      city: randomData.starshipManufacturers[
        randomNumberBetween(0, randomData.starshipManufacturers.length - 1)
      ],
      numRatings: ratingsData.length,
      sumRating: ratingsData.reduce(
        (accumulator, currentValue) => accumulator + currentValue.rating,
        0
      ),
      price: randomNumberBetween(1, 4),
      photo: `https://storage.googleapis.com/firestorequickstarts.appspot.com/food_${randomNumberBetween(
        1,
        22
      )}.png`,
      timestamp: starshipTimestamp,
    };

    data.push({
      starshipData,
      ratingsData,
    });
  }
  return data;
}

