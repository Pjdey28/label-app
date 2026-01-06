import { NextResponse } from "next/server";
import { getIngredientsFromOFF } from "@/lib/openfoodfacts";
import { websetsConceptualize } from "@/lib/websets";
import { c1Chain } from "@/lib/chains";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    let ingredientsText =
      (formData.get("ingredients") as string)?.trim() || "";

    let productName = "User provided label";

    if (!ingredientsText) {
      const off = await getIngredientsFromOFF();
      ingredientsText = off.ingredientsText;
      productName = off.productName;
    }

    const ingredients = ingredientsText
      .split(",")
      .map(i => i.trim())
      .filter(Boolean);

    const concepts = websetsConceptualize(ingredients);

    const result = await c1Chain.invoke({
      productName,
      concepts: JSON.stringify(concepts),
      ingredients: ingredientsText,
    });

    console.log("Raw LLM Result:", JSON.stringify(result, null, 2));

    // Extract content from various response formats
    let c1Content = result?.content || result?.text || String(result);
    
    if (typeof c1Content !== "string") {
      console.log("Content is not string, type:", typeof c1Content);
      c1Content = JSON.stringify(c1Content);
    }

    console.log("Extracted Content:", c1Content);

    // Clean and validate the XML
    c1Content = c1Content.trim();
    
    // If the response doesn't contain proper C1 tags, it's invalid
    if (!c1Content.includes("<C1") || !c1Content.includes("</C1>")) {
      console.error("Invalid C1 format detected. Content:", c1Content);
      throw new Error("AI response doesn't contain valid C1 XML");
    }

    console.log("Final valid C1:", c1Content);
    return NextResponse.json({ c1: c1Content });

  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("❌ API Error Details:", {
      message: errorMsg,
      fullError: err,
      timestamp: new Date().toISOString()
    });

    // HARD FALLBACK — NEVER BREAK UI
    return NextResponse.json({
      c1: `<C1>
        <Insight emphasis="high">
          Unable to generate AI response.
        </Insight>
        <Uncertainty emphasis="high">
          The AI service may be unavailable or rate-limited.
        </Uncertainty>
        <Takeaway emphasis="medium">
          Please try again later.
        </Takeaway>
      </C1>`,
      error: errorMsg
    });
  }
}


