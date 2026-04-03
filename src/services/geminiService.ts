import { GoogleGenAI, Type } from "@google/genai";
import { Product, UserProfile } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

// Simple session-based cache
const recommendationCache: Record<string, Product[]> = {};
const stylistCache: Record<string, string> = {};

export async function getPersonalizedRecommendations(user: UserProfile, products: Product[]): Promise<Product[]> {
  const cacheKey = `${user.uid}_${user.wishlist.join(',')}_${user.recentlyViewed.join(',')}`;
  if (recommendationCache[cacheKey]) {
    return recommendationCache[cacheKey];
  }

  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Based on the user's profile and preferences, recommend the top 3 products from the provided list.
    User Preferences: ${JSON.stringify(user.preferences)}
    Wishlist: ${user.wishlist.join(", ")}
    Recently Viewed: ${user.recentlyViewed.join(", ")}
    
    Products: ${JSON.stringify(products.map(p => ({ id: p.id, name: p.name, category: p.category, metalType: p.metalType })))}
    
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
          items: { type: Type.STRING }
        }
      }
    });

    const recommendedIds = JSON.parse(response.text || "[]");
    const result = products.filter(p => recommendedIds.includes(p.id));
    recommendationCache[cacheKey] = result;
    return result;
  } catch (error: any) {
    console.error("AI Recommendation Error:", error);
    if (error?.status === 'RESOURCE_EXHAUSTED' || error?.code === 429) {
      console.warn("Gemini API quota exceeded. Using fallback recommendations.");
    }
    return products.slice(0, 3); // Fallback to first 3 products
  }
}

export async function getSmartStylistAdvice(user: UserProfile, occasion: string): Promise<string> {
  const cacheKey = `${user.uid}_${occasion}`;
  if (stylistCache[cacheKey]) {
    return stylistCache[cacheKey];
  }

  const model = "gemini-3-flash-preview";
  
  const prompt = `
    You are a luxury jewellery stylist. A user is looking for jewellery for a ${occasion}.
    User Preferences: ${JSON.stringify(user.preferences)}
    
    Provide professional, elegant advice on what kind of jewellery would suit them best for this occasion.
    Keep it concise and premium in tone.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    const result = response.text || "Our stylists recommend classic gold pieces for a timeless look.";
    stylistCache[cacheKey] = result;
    return result;
  } catch (error: any) {
    console.error("AI Stylist Error:", error);
    if (error?.status === 'RESOURCE_EXHAUSTED' || error?.code === 429) {
      console.warn("Gemini API quota exceeded. Using fallback stylist advice.");
    }
    return "Classic gold pieces are always a great choice for any occasion.";
  }
}
