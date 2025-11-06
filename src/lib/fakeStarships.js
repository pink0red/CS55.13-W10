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

    // Map ship classes to image number ranges for more variety
    const classImageRanges = {
      "Cruiser": [1, 4],
      "Destroyer": [5, 8],
      "Freighter": [9, 12],
      "Fighter": [13, 16],
      "Dreadnought": [17, 20],
      "Scout": [21, 24],
      "Carrier": [25, 28],
      "Explorer": [29, 32],
      "Battleship": [33, 36],
      "Corvette": [37, 40],
      "Frigate": [41, 44],
      "Interceptor": [45, 48],
      "Transport": [49, 52],
      "Research Vessel": [53, 56],
    };

    const shipClass = randomData.starshipClasses[
      randomNumberBetween(0, randomData.starshipClasses.length - 1)
    ];
    const range = classImageRanges[shipClass] || [1, 22];
    const imageNumber = randomNumberBetween(range[0], range[1]);

    const starshipData = {
      shipclass: shipClass,
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
      photo: `/starshipimages/starship_${imageNumber}.jpg`,
      timestamp: starshipTimestamp,
    };

    data.push({
      starshipData,
      ratingsData,
    });
  }
  return data;
}

