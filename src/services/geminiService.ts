import { GoogleGenAI, Type } from "@google/genai";
import { Product, UserProfile } from "../types";

// Gemini is optional for now.
// The app will continue working even when no API key is configured.
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Simple session-based cache
const recommendationCache: Record<string, Product[]> = {};
const stylistCache: Record<string, string> = {};

export async function getPersonalizedRecommendations(
  user: UserProfile,
  products: Product[],
): Promise<Product[]> {
  const cacheKey = `${user.uid}_${user.wishlist.join(",")}_${user.recentlyViewed.join(",")}`;

  // Return cached recommendations if available
  if (recommendationCache[cacheKey]) {
    return recommendationCache[cacheKey];
  }

  // Gemini is not configured yet.
  // Return a simple fallback so the application keeps working.
  if (!ai) {
    console.warn(
      "Gemini API key is not configured. Using fallback recommendations.",
    );

    const fallbackProducts = products.slice(0, 3);
    recommendationCache[cacheKey] = fallbackProducts;

    return fallbackProducts;
  }

  const model = "gemini-3-flash-preview";

  const prompt = `
    Based on the user's profile and preferences, recommend the top 3 products
    from the provided list.

    User Preferences: ${JSON.stringify(user.preferences)}

    Wishlist: ${user.wishlist.join(", ")}

    Recently Viewed: ${user.recentlyViewed.join(", ")}

    Products: ${JSON.stringify(
      products.map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        metalType: p.metalType,
      })),
    )}

    Return only the IDs of the recommended products as a JSON array.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
          },
        },
      },
    });

    const recommendedIds = JSON.parse(response.text || "[]");

    const result = products.filter((product) =>
      recommendedIds.includes(product.id),
    );

    // If Gemini returns no valid products, use fallback
    if (result.length === 0) {
      const fallbackProducts = products.slice(0, 3);
      recommendationCache[cacheKey] = fallbackProducts;

      return fallbackProducts;
    }

    recommendationCache[cacheKey] = result;

    return result;
  } catch (error: unknown) {
    console.error("AI Recommendation Error:", error);

    if (
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      (error.status === "RESOURCE_EXHAUSTED" || error.status === 429)
    ) {
      console.warn(
        "Gemini API quota exceeded. Using fallback recommendations.",
      );
    }

    const fallbackProducts = products.slice(0, 3);
    recommendationCache[cacheKey] = fallbackProducts;

    return fallbackProducts;
  }
}

export async function getSmartStylistAdvice(
  user: UserProfile,
  occasion: string,
): Promise<string> {
  const cacheKey = `${user.uid}_${occasion}`;

  // Return cached advice if available
  if (stylistCache[cacheKey]) {
    return stylistCache[cacheKey];
  }

  // Gemini is not configured yet.
  // Return fallback advice instead of crashing the application.
  if (!ai) {
    console.warn(
      "Gemini API key is not configured. Using fallback stylist advice.",
    );

    const fallbackAdvice =
      "Classic gold pieces are always a great choice for a timeless and elegant look.";

    stylistCache[cacheKey] = fallbackAdvice;

    return fallbackAdvice;
  }

  const model = "gemini-3-flash-preview";

  const prompt = `
    You are a luxury jewellery stylist.

    A user is looking for jewellery for a ${occasion}.

    User Preferences: ${JSON.stringify(user.preferences)}

    Provide professional, elegant advice on what kind of jewellery
    would suit them best for this occasion.

    Keep it concise and premium in tone.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    const result =
      response.text ||
      "Our stylists recommend classic gold pieces for a timeless look.";

    stylistCache[cacheKey] = result;

    return result;
  } catch (error: unknown) {
    console.error("AI Stylist Error:", error);

    if (
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      (error.status === "RESOURCE_EXHAUSTED" || error.status === 429)
    ) {
      console.warn(
        "Gemini API quota exceeded. Using fallback stylist advice.",
      );
    }

    const fallbackAdvice =
      "Classic gold pieces are always a great choice for a timeless and elegant look.";

    stylistCache[cacheKey] = fallbackAdvice;

    return fallbackAdvice;
  }
}