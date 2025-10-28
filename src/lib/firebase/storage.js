import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import { storage } from "@/src/lib/firebase/clientApp";

import { updateStarshipImageReference } from "@/src/lib/firebase/firestore";

export async function updateStarshipImage(starshipId, image) {
  try {
    if (!starshipId) {
      throw new Error("No starship ID has been provided.");
    }

    if (!image || !image.name) {
      throw new Error("A valid image has not been provided.");
    }

    const publicImageUrl = await uploadImage(starshipId, image);
    await updateStarshipImageReference(starshipId, publicImageUrl);

    return publicImageUrl;
  } catch (error) {
    console.error("Error processing request:", error);
  }
}

async function uploadImage(starshipId, image) {
  const filePath = `images/${starshipId}/${image.name}`;
  const newImageRef = ref(storage, filePath);
  await uploadBytesResumable(newImageRef, image);

  return await getDownloadURL(newImageRef);
}
