import { GoogleGenAI, Type } from "@google/genai";
import type { GroundingChunk } from "@google/genai";
import type { MarketplaceProduct, TitleSuggestion, CompetitionInfo, Supplier, PricePoint, ArbitrageOpportunity, TrendingProduct } from '../types';
import { CompetitionLevel } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const parseSources = (chunks: GroundingChunk[] | undefined): { title: string; url: string }[] => {
    if (!chunks) return [];
    return chunks.map(chunk => ({
        url: chunk.web?.uri || '#',
        title: chunk.web?.title || 'Source'
    })).filter(source => source.url !== '#');
};

const safeJsonParse = <T>(jsonString: string): T | null => {
    const cleanedString = jsonString.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim();
    try {
        return JSON.parse(cleanedString) as T;
    } catch (e) {
        console.error("Failed to parse JSON:", cleanedString, e);
        return null;
    }
};

const arbitrageOpportunitySchema = {
    type: Type.OBJECT,
    properties: {
        amazonProduct: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                price: { type: Type.NUMBER },
                imageUrl: { type: Type.STRING }
            },
            required: ["title", "price", "imageUrl"]
        },
        ebayOpportunity: {
            type: Type.OBJECT,
            properties: {
                suggestedTitle: { type: Type.STRING },
                suggestedPrice: { type: Type.NUMBER },
                potentialProfit: { type: Type.NUMBER }
            },
            required: ["suggestedTitle", "suggestedPrice", "potentialProfit"]
        },
        analysis: { type: Type.STRING },
        viability: { type: Type.STRING, enum: ['Good', 'Fair', 'Poor']}
    },
    required: ["amazonProduct", "ebayOpportunity", "analysis", "viability"]
};


const geminiService = {
  async searchMarketplaces(keyword: string): Promise<MarketplaceProduct[]> {
    const prompt = `
      Search for "${keyword}" on eBay, Amazon, Walmart, Shopify, Etsy, and TikTok Shop. 
      For each marketplace, find the top 2-3 most relevant product listings.
      Extract the full product title and the marketplace it was found on.
      Format the output as a JSON array of objects, where each object has "title" and "source" keys.
      Example: [{"title": "Example Product Title", "source": "eBay"}, ...]
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                source: { type: Type.STRING },
                url: { type: Type.STRING, description: 'The direct URL to the product listing.'}
              },
              required: ["title", "source", "url"],
            }
          }
        },
    });

    const text = response.text.trim();
    try {
        const data = JSON.parse(text);
        if (!Array.isArray(data)) return [];
        return data.map((item: any) => ({
            title: item.title || 'No title found',
            source: item.source || 'Unknown source',
            url: item.url || '#'
        }));
    } catch (e) {
        console.error("Failed to parse marketplace results:", text);
        return [];
    }
  },

  async optimizeTitle(keyword: string, userTitle: string, existingTitles: string[]): Promise<TitleSuggestion[]> {
    const prompt = `
      You are an expert in e-commerce SEO and product title optimization.
      The target product keyword is "${keyword}".
      The user's current title is: "${userTitle || 'not provided'}".
      Here are some competitor titles from various marketplaces: ${JSON.stringify(existingTitles.slice(0, 10))}.

      Analyze the competitor titles and the user's title.
      Generate 4-5 improved, SEO-friendly product titles.
      For each suggested title, provide a brief, compelling reason explaining why it's a better choice, focusing on keywords, clarity, and buyer appeal.
    `;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING, description: 'The suggested new title.' },
                    reasoning: { type: Type.STRING, description: 'The explanation for why this title is an improvement.' }
                },
                required: ["title", "reasoning"],
            }
          }
        }
    });

    const text = response.text.trim();
    try {
      const data = JSON.parse(text);
      if (!Array.isArray(data)) return [];
      return data;
    } catch (e) {
      console.error("Failed to parse title suggestions:", text);
      return [];
    }
  },

  async analyzeCompetition(keyword: string): Promise<CompetitionInfo> {
    const prompt = `
      Analyze the market competition for "${keyword}" on major online marketplaces like eBay, Amazon, and Etsy.
      Use search to find real data on the number of sellers, listing saturation, and price range diversity.
      Based on your search, provide a competition level ("High", "Medium", or "Low") and a concise analysis.
      Return the result as a single JSON object with two keys: "competitionLevel" and "analysisText". Do not add any other text.
      Example: {"competitionLevel": "Medium", "analysisText": "The market shows a moderate number of sellers..."}
    `;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            tools: [{ googleSearch: {} }],
        }
    });

    const text = response.text.trim();
    const sources = parseSources(response.candidates?.[0]?.groundingMetadata?.groundingChunks);

    const parsed = safeJsonParse<{ competitionLevel: string; analysisText: string }>(text);

    let level: CompetitionLevel = CompetitionLevel.UNKNOWN;
    if (parsed) {
        const pLevel = parsed.competitionLevel.toLowerCase();
        if (pLevel === 'high') level = CompetitionLevel.HIGH;
        else if (pLevel === 'medium') level = CompetitionLevel.MEDIUM;
        else if (pLevel === 'low') level = CompetitionLevel.LOW;
    }

    return {
      level,
      analysis: parsed?.analysisText || "Could not analyze competition.",
      sources,
    };
  },

  async findSuppliers(keyword: string): Promise<Supplier[]> {
    const prompt = `
      Find potential wholesale, dropshipping, or manufacturer suppliers for "${keyword}".
      Search for suppliers on sites like Alibaba, AliExpress, or other B2B platforms.
      For each supplier found, provide their name, website URL, and a brief description or key details (e.g., price range, minimum order quantity).
      Return ONLY the result as a JSON array of objects, where each object has "name", "url", and "details" keys.
      Do not include any other text or markdown formatting.
      Example format: [{"name": "Supplier A", "url": "https://supplier-a.com", "details": "MOQ: 100 units"}]
    `;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            tools: [{ googleSearch: {} }]
        },
    });

    const data = safeJsonParse<any[]>(response.text);
    if (!data || !Array.isArray(data)) return [];
    
    return data.map(item => ({
        name: item.name || 'Unknown Supplier',
        url: item.url || '#',
        details: item.details || 'No details provided'
    }));
  },

  async getPriceInsights(keyword: string): Promise<PricePoint[]> {
    const prompt = `
      For the product "${keyword}", use Google Search to find its price range on Amazon, eBay, and Walmart.
      For each marketplace, find the minimum, maximum, and average price for relevant listings.
      Return the results as a JSON array of objects. Each object should have keys: "source", "minPrice", "maxPrice", and "avgPrice".
      All prices should be numbers, without currency symbols.
      If you cannot find data for a marketplace, omit it from the array.
      Return ONLY the JSON array. Do not add any other text or markdown formatting.
      Example: [{"source": "Amazon", "minPrice": 49.99, "maxPrice": 89.99, "avgPrice": 65.50}]
    `;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            tools: [{ googleSearch: {} }],
        },
    });

    const data = safeJsonParse<any[]>(response.text);
    if (!data || !Array.isArray(data)) return [];

    return data
      .map(item => ({
        source: item.source || 'Unknown',
        minPrice: typeof item.minPrice === 'number' ? item.minPrice : 0,
        maxPrice: typeof item.maxPrice === 'number' ? item.maxPrice : 0,
        avgPrice: typeof item.avgPrice === 'number' ? item.avgPrice : 0,
      }))
      .filter(item => item.source !== 'Unknown' && item.maxPrice > 0);
  },

  async findArbitrageOpportunity(amazonUrl: string): Promise<ArbitrageOpportunity> {
    const prompt = `
      You are an expert e-commerce arbitrage analyst. Your goal is to determine if a product from Amazon can be profitably resold on eBay with a target ROI of 30%.
      The user has provided this Amazon URL: ${amazonUrl}

      Follow these steps:
      1.  **Analyze the Amazon Product:** Using Google Search, analyze the provided Amazon URL to extract the following information:
          *   The full product title.
          *   The current price in numbers (e.g., 49.99).
          *   A URL for the main product image.

      2.  **Research on eBay:** Using the product title from step 1, search on eBay to find the typical selling price range for the same or very similar *new* condition products.

      3.  **Calculate Resale Viability:**
          *   The **Cost** is the Amazon price.
          *   The **Target ROI** is 30%.
          *   Assume standard **eBay fees** are 15% of the final sale price.
          *   Calculate the required eBay selling price using the formula: Target eBay Price = (Amazon Price * 1.30) / (1 - 0.15).
          *   Calculate the **Potential Profit**: Potential Profit = (Target eBay Price * (1 - 0.15)) - Amazon Price.

      4.  **Formulate Recommendation:**
          *   Compare the calculated 'Target eBay Price' with the typical selling price you found on eBay.
          *   Determine the viability of this arbitrage opportunity. Categorize it as 'Good', 'Fair', or 'Poor'.
              *   'Good': The calculated price is well within or below the typical eBay price range.
              *   'Fair': The calculated price is at the high end of or slightly above the typical eBay price range, might be difficult to sell.
              *   'Poor': The calculated price is significantly higher than the typical eBay price, making it unprofitable.
          *   Create an SEO-optimized title for the eBay listing.
          *   Write a concise analysis explaining your recommendation. Mention the market on eBay and why it is (or isn't) a good opportunity.

      5.  **Format the Output:** Return a single JSON object. Do not include any other text, explanations, or markdown formatting. The object should have the following structure: {"amazonProduct": {"title": "...", "price": ...,"imageUrl": "..."}, "ebayOpportunity": {"suggestedTitle": "...", "suggestedPrice": ..., "potentialProfit": ...}, "analysis": "...", "viability": "..."}
    `;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            tools: [{ googleSearch: {} }],
        },
    });

    const data = safeJsonParse<ArbitrageOpportunity>(response.text);
    if (!data) {
        throw new Error("Failed to parse arbitrage opportunity data from the AI.");
    }
    return data;
  },

  async discoverArbitrageOpportunities(category: string): Promise<ArbitrageOpportunity[]> {
    const prompt = `
      You are an expert e-commerce arbitrage analyst. Your goal is to find multiple products from Amazon within a given category that can be profitably resold on eBay with a target ROI of 30%.
      The user has provided this product category: "${category}"

      Follow these steps:
      1.  **Search Amazon:** Using Google Search, find 3-5 popular or promising products on Amazon within the specified category.

      2.  **For each product found, perform a full analysis:**
          a.  **Analyze Amazon Product:** Extract the full product title, current price (as a number), and a main product image URL.
          b.  **Research eBay Market:** Search eBay for the typical selling price range of the same or very similar *new* condition products.
          c.  **Calculate Viability:**
              *   Cost = Amazon Price
              *   Target ROI = 30%
              *   Assume eBay fees = 15% of sale price
              *   Target eBay Price = (Amazon Price * 1.30) / (1 - 0.15)
              *   Potential Profit = (Target eBay Price * (1 - 0.15)) - Amazon Price
          d.  **Formulate Recommendation:** Compare the calculated 'Target eBay Price' with the actual eBay market price. Determine viability ('Good', 'Fair', or 'Poor'). Create an optimized eBay title and a brief analysis.
      
      3.  **Filter Results:** Only include the products that you determine to have 'Good' or 'Fair' viability in the final output. Discard any 'Poor' opportunities.

      4.  **Format the Output:** Return a JSON array of objects, where each object represents a viable arbitrage opportunity. The structure of each object must be the same as the one used for single opportunity analysis. If no profitable opportunities are found, return an empty array. Do not include any other text, explanations, or markdown formatting.
    `;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            tools: [{ googleSearch: {} }],
        },
    });

    const data = safeJsonParse<ArbitrageOpportunity[]>(response.text);
    if (!data) {
      throw new Error("Failed to parse arbitrage discovery data from the AI.");
    }
    return data;
  },

  async findTrendingProducts(): Promise<TrendingProduct[]> {
    const prompt = `
      You are an expert e-commerce trend analyst. Your goal is to identify products that are currently trending or going viral on various marketplaces and analyze their potential for resale on eBay.

      Follow these steps:
      1.  **Scan for Trends:** Use Google Search to find trending products on platforms known for viral content, such as TikTok Shop, Etsy, Amazon Launchpad, and popular product review blogs. Look for products with rapidly increasing social media mentions, sales velocity, or search interest. Identify 5-6 promising products.

      2.  **For each product found, perform an analysis:**
          a.  **Identify Product:** Get the product's name, a high-quality image URL, and the marketplace where it's currently trending.
          b.  **Analyze the Trend:** Write a brief description explaining *why* the product is trending (e.g., a viral video, a celebrity endorsement, a unique feature).
          c.  **Assess eBay Resale Potential:** Briefly analyze the opportunity to resell this product on eBay. Consider if the trend is likely to carry over, if the product is easily sourceable, and if there's an existing market on eBay.
          d.  **Assign Trend Score:** Give the product a trend score: 'Hot' (currently viral), 'High' (strong upward trend), or 'Medium' (gaining steady interest).

      3.  **Format the Output:** Return a JSON array of objects, where each object represents a trending product. Do not include any other text, explanations, or markdown formatting. If no trending products are found, return an empty array.

      The JSON structure for each object must be:
      {
        "name": "...",
        "description": "...",
        "sourceMarketplace": "...",
        "imageUrl": "...",
        "ebayResaleAnalysis": "...",
        "trendScore": "..."
      }
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            tools: [{ googleSearch: {} }],
        },
    });

    const data = safeJsonParse<TrendingProduct[]>(response.text);
    if (!data) {
      throw new Error("Failed to parse trending product data from the AI.");
    }
    return data;
  },

};

export { geminiService };
