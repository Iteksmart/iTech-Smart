async function handler({
  query,
  category,
  random,
  targetWidth,
  targetHeight,
  fit = "cover",
}) {
  const MIN_WIDTH = 2000;
  const MIN_HEIGHT = 1500;
  const MIN_QUALITY = 80;

  const categories = {
    nature: "nature,landscape,forest,mountains",
    people: "people,portrait,face,crowd",
    urban: "city,architecture,building,street",
    food: "food,cooking,restaurant,meal",
    animals: "animals,wildlife,pets,birds",
    technology: "technology,computer,digital,office",
    abstract: "abstract,pattern,texture,minimal",
    travel: "travel,adventure,vacation,tourism",
    sports: "sports,fitness,exercise,athlete",
    business: "business,office,meeting,professional",
  };

  if (!query && !category && !random) {
    return {
      error: "Please provide a search query, category, or set random to true",
    };
  }

  const targetAspectRatio =
    targetWidth && targetHeight ? targetWidth / targetHeight : null;

  let orientation = "";
  if (targetAspectRatio) {
    if (targetAspectRatio > 1.2) orientation = "&orientation=landscape";
    else if (targetAspectRatio < 0.8) orientation = "&orientation=portrait";
    else orientation = "&orientation=square";
  }

  const searchQuery = query
    ? query
    : categories[category.toLowerCase()] || category;

  const perPage = random ? 30 : 80;
  const page = random ? Math.floor(Math.random() * 20) : 1;

  const baseUrl = searchQuery
    ? `https://api.pexels.com/v1/search?query=${encodeURIComponent(
        searchQuery
      )}&per_page=${perPage}&page=${page}${orientation}&size=large`
    : `https://api.pexels.com/v1/curated?per_page=${perPage}&page=${page}${orientation}&size=large`;

  try {
    const response = await fetch(baseUrl, {
      headers: {
        Authorization: process.env.PEXELS_API_KEY,
      },
    });

    const data = await response.json();

    if (!data.photos || data.photos.length === 0) {
      return null;
    }

    const highQualityPhotos = data.photos.filter(
      (photo) => photo.width >= MIN_WIDTH && photo.height >= MIN_HEIGHT
    );

    if (highQualityPhotos.length === 0) {
      return { error: "No high-quality images found matching your criteria" };
    }

    const getAspectRatioDifference = (photo) => {
      if (!targetAspectRatio) return 0;
      const photoAspectRatio = photo.width / photo.height;
      return Math.abs(photoAspectRatio - targetAspectRatio);
    };

    const sortPhotos = (photos) => {
      return photos.sort((a, b) => {
        const aRatioDiff = getAspectRatioDifference(a);
        const bRatioDiff = getAspectRatioDifference(b);

        if (Math.abs(aRatioDiff - bRatioDiff) < 0.1) {
          return b.width * b.height - a.width * a.height;
        }
        return aRatioDiff - bRatioDiff;
      });
    };

    const sortedPhotos = sortPhotos(highQualityPhotos);

    if (random) {
      const topMatches = sortedPhotos.slice(0, 5);
      const selectedPhoto =
        topMatches[Math.floor(Math.random() * topMatches.length)];

      return {
        url: selectedPhoto.src.original,
        photographer: selectedPhoto.photographer,
        photographerUrl: selectedPhoto.photographer_url,
        width: selectedPhoto.width,
        height: selectedPhoto.height,
        aspectRatio: selectedPhoto.width / selectedPhoto.height,
        quality: {
          width: selectedPhoto.width,
          height: selectedPhoto.height,
          resolution: `${selectedPhoto.width}x${selectedPhoto.height}`,
        },
        fit,
      };
    }

    const images = sortedPhotos.map((photo) => ({
      id: photo.id,
      url: photo.src.original,
      width: photo.width,
      height: photo.height,
      photographer: photo.photographer,
      thumbnail: photo.src.large,
      category: category || "custom",
      aspectRatio: photo.width / photo.height,
      quality: {
        width: photo.width,
        height: photo.height,
        resolution: `${photo.width}x${photo.height}`,
      },
      fit,
    }));

    return {
      images,
      categories: Object.keys(categories),
      targetDimensions:
        targetWidth && targetHeight
          ? {
              width: targetWidth,
              height: targetHeight,
              aspectRatio: targetAspectRatio,
            }
          : null,
      qualityThresholds: {
        minWidth: MIN_WIDTH,
        minHeight: MIN_HEIGHT,
        minQuality: MIN_QUALITY,
      },
    };
  } catch (error) {
    return { error: "Failed to fetch images" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}