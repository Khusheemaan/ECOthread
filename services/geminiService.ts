
import { GoogleGenAI, Type } from "@google/genai";

// Use process.env.API_KEY directly as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAssistantChat = () => {
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are the ECOthread Loop Assistant. Your goal is to help users with:
1. Circular Fashion: Explain what it is and why it matters.
2. Styling (Wear): Provide inspiration for re-wearing clothes.
3. Repairing (Care): Give advice on mending and fabric care.
4. Marketplace (Share): Explain how swapping and selling works on the platform.
5. Business Queries: Answer questions about ECOthread's mission to reduce fast fashion waste.
Be helpful, professional, and encouraging. Keep responses relatively concise but informative.`,
    },
  });
};

export const getOutfitSuggestions = async (garmentDescription: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate 3 Pinterest-style outfit combinations for a ${garmentDescription}. Focus on creative re-wear and sustainability.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              items: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["title", "description", "items"]
          }
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error generating outfits:", error);
    return null;
  }
};

export const getRepairAdvice = async (issue: string, fabric: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a quick 3-step repair guide for a ${issue} on a ${fabric} garment. Also provide a specific search query for a YouTube tutorial that would help with this exact repair.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            guideTitle: { type: Type.STRING },
            steps: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            proTip: { type: Type.STRING },
            youtubeSearchQuery: { type: Type.STRING }
          },
          required: ["guideTitle", "steps", "proTip", "youtubeSearchQuery"]
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error generating repair advice:", error);
    return null;
  }
};

export const getUpcyclingIdeas = async (imageBase64: string) => {
  try {
    // Extract just the base64 data, removing the data URL prefix if present
    const base64Data = imageBase64.split(',')[1] || imageBase64;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Data
            }
          },
          {
            text: `Analyze this image to identify the garment type and material. Then, suggest 3 creative DIY upcycling or alteration projects for this specific item to give it a completely new life. 
            Examples: "T-shirt to Crop Top", "Jeans to Tote Bag". 
            Include a difficulty rating, estimated time, list of materials needed, and 3-4 simplified steps.`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              projectTitle: { type: Type.STRING },
              difficulty: { type: Type.STRING },
              time: { type: Type.STRING },
              description: { type: Type.STRING },
              materials: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              steps: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["projectTitle", "difficulty", "time", "description", "materials", "steps"]
          }
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error generating upcycling ideas:", error);
    return null;
  }
};

export const verifyActionProof = async (imageBase64: string, actionType: 'Creator' | 'Merchant' | 'Recycler') => {
  try {
    const base64Data = imageBase64.split(',')[1] || imageBase64;
    
    let prompt = "";
    if (actionType === 'Creator') {
      prompt = "Analyze this image. Does it look like a piece of clothing that is being repaired, upcycled, or a sewing project? Return JSON with boolean 'valid' and a short 'reason'.";
    } else if (actionType === 'Merchant') {
      prompt = "Analyze this image. Does it look like a piece of clothing laid out nicely for sale or a screenshot of a marketplace listing? Return JSON with boolean 'valid' and a short 'reason'.";
    } else if (actionType === 'Recycler') {
      prompt = "Analyze this image. Does it look like a donation receipt, a textile recycling bin, or a bag of clothes ready for donation? Return JSON with boolean 'valid' and a short 'reason'.";
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Data } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            valid: { type: Type.BOOLEAN },
            reason: { type: Type.STRING }
          },
          required: ["valid", "reason"]
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error verifying proof:", error);
    return { valid: false, reason: "AI verification failed. Please try again." };
  }
};

export const findLocalRepairShops = async (latitude?: number, longitude?: number, postalCode?: string) => {
  try {
    let query = "Find clothing repair shops, tailors, thrift shops, fabric stores, and sustainable clothing stores";
    if (postalCode) {
      query += ` in or near postal code ${postalCode}`;
    } else if (latitude && longitude) {
      query += " near my current location";
    } else {
      query += " nearby";
    }

    // Using gemini-2.5-flash as it is the correctly qualified model for Maps grounding
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: query,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: latitude && longitude ? {
              latitude,
              longitude
            } : undefined
          }
        }
      },
    });
    
    // Extracting locations from grounding metadata
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    return {
      text: response.text,
      locations: chunks?.filter((c: any) => c.maps).map((c: any) => ({
        title: c.maps?.title || "Local Shop",
        uri: c.maps?.uri || "#",
        snippet: c.maps?.placeAnswerSources?.[0]?.reviewSnippets?.[0] || ""
      })) || []
    };
  } catch (error) {
    console.error("Error finding repair shops:", error);
    throw error;
  }
};
