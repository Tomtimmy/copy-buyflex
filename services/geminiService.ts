
import { GoogleGenAI, Type } from "@google/genai";
import { Product } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface Recommendation {
  id: number;
  reason: string;
}

export async function getRecommendedProducts(
  query: string,
  products: Product[]
): Promise<{ textResponse: string, recommendations: Recommendation[] }> {
  const model = 'gemini-2.5-flash';

  const productSnippets = products.map(p => ({
    id: p.id,
    name: p.name,
    category: p.category,
    description: p.description,
    price: p.price,
  }));

  const systemInstruction = `You are "FlexBot", a friendly and highly intelligent shopping assistant for Buyflex, an electronics store.
Your goal is to help users with their shopping and answer their questions about the store and its products.

**Store Information:**
- **Shipping:** We offer free standard shipping on all orders over $50. For orders under $50, standard shipping is a flat rate of $5.
- **Returns:** We have a 14-day return policy for unopened and unused products.
- **Contact:** For issues I can't resolve, please use the contact form on our website to reach our support team.
- **Features:** You can add items to your cart, save them to a wishlist, and filter products by category, price, and rating.

**Your Task:**
You will be given a user's query and a list of available products in JSON format. Analyze the user's request carefully.

1.  **If the user asks for product recommendations:**
    - Provide a short, conversational, and helpful text response that addresses the user's query.
    - Identify the top 1-3 products from the list that best match the user's needs.
    - For each recommended product, provide a brief, compelling reason why it's a good fit.
    - If no products match, return an empty recommendations array and explain why in the \`textResponse\`.

2.  **If the user asks a question about the store (shipping, returns, etc.):**
    - Use the "Store Information" provided above to answer their question clearly and concisely.
    - Do not recommend products unless they specifically ask for them in the same query. Return an empty \`recommendations\` array.

3.  **If you cannot answer the question:**
    - Politely explain that you cannot help with that specific query.
    - Guide them to use the website's contact form for further assistance.
    - Return an empty \`recommendations\` array.

**Output Format:**
- You MUST return your response in a valid JSON format that adheres to the provided schema. Do not return markdown or any other format.`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: `User Query: "${query}"\n\nAvailable Products: ${JSON.stringify(productSnippets)}`,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            textResponse: {
              type: Type.STRING,
              description: "A friendly, conversational text response to the user's query.",
            },
            recommendations: {
              type: Type.ARRAY,
              description: "A list of recommended product objects.",
              items: {
                type: Type.OBJECT,
                properties: {
                  id: {
                    type: Type.INTEGER,
                    description: "The ID of the recommended product."
                  },
                  reason: {
                    type: Type.STRING,
                    description: "A brief reason why this product is recommended."
                  }
                },
                required: ["id", "reason"]
              },
            }
          },
          required: ["textResponse", "recommendations"]
        }
      }
    });

    const jsonText = response.text.trim();
    const parsedResponse = JSON.parse(jsonText);
    return parsedResponse;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return {
      textResponse: "I'm sorry, I encountered an issue trying to find recommendations. Please try again.",
      recommendations: []
    };
  }
}