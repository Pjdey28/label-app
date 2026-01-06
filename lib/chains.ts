import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GEMINI_API_KEY!,
  temperature: 0.2,
});

const c1Prompt = PromptTemplate.fromTemplate(`
You are generating UI output for the C1 renderer.

STRICT RULES:
- Output ONLY valid C1 XML, nothing else
- DO NOT use markdown
- DO NOT use code fences (no backticks)
- DO NOT add explanations before or after
- Root tag MUST be <C1>
- Use ONLY these tags: <Insight>, <Evidence>, <Tradeoff>, <Uncertainty>, <Takeaway>
- Do NOT invent new tags
- Keep it concise
- Every tag must have a closing tag

Example format:
<C1>
<Insight emphasis="high">Your insight here</Insight>
<Takeaway>Your takeaway here</Takeaway>
</C1>

Context:
Product: {productName}
Ingredients: {ingredients}

Generate the C1 output now in the exact format shown above:
`);
export const c1Chain = RunnableSequence.from([c1Prompt, llm]);
