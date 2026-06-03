import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const ideaInput = z.object({
  skills: z.string().min(1).max(2000),
  passions: z.string().min(1).max(2000),
  worldNeeds: z.string().min(1).max(2000),
  resources: z.string().max(2000).optional().default(""),
});

export type BusinessIdea = {
  name: string;
  tagline: string;
  problem: string;
  solution: string;
  audience: string;
  firstSteps: string[];
  monetization: string;
  whyYou: string;
};

async function callGateway(body: unknown) {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new Error("LOVABLE_API_KEY is not configured");
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (res.status === 429) throw new Error("Rate limit reached. Please try again in a moment.");
  if (res.status === 402) throw new Error("AI credits exhausted. Add credits in workspace settings to continue.");
  if (!res.ok) {
    const t = await res.text();
    console.error("AI gateway error", res.status, t);
    throw new Error("AI request failed");
  }
  return res.json();
}

export const generateIdeas = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => ideaInput.parse(data))
  .handler(async ({ data }) => {
    const system = `You are Spark, a sharp, warm startup mentor for young South African aspiring entrepreneurs (especially graduates and youth from townships, rural, and underprivileged areas) facing the 19.5% graduate unemployment rate, limited tech access, and tight capital. You generate concrete, scrappy, ultra-low-capital business ideas grounded in the South African context — local market realities, side-hustle-to-business paths, township and rural opportunities, informal economy on-ramps, stokvels, SASSA, load-shedding workarounds, and ZAR pricing. Prefer ideas that need a basic smartphone or a shared device, can start with under R1,000, and build real work experience or skills along the way. Be specific, encouraging, grounded — no fluff, no jargon, no Silicon Valley clichés.`;

    const user = `Generate 3 distinct business ideas for this person.

Skills: ${data.skills}
Passions: ${data.passions}
World needs they care about: ${data.worldNeeds}
Available resources / constraints: ${data.resources || "limited budget, solo founder, just getting started"}

For each idea, return: a short bold name, a 1-line tagline, the specific problem (rooted in South African reality where relevant), the solution, the target audience (be concrete — e.g. "matric learners in Limpopo", "spaza shop owners in Soweto"), 3 concrete first steps they can take this week in South Africa using free or near-free tools (WhatsApp, free Wi-Fi spots, library computers, community noticeboards), a monetization model priced in ZAR, and a personal "why you" sentence connecting it back to their inputs.`;

    const result = await callGateway({
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "return_ideas",
            description: "Return business ideas",
            parameters: {
              type: "object",
              properties: {
                ideas: {
                  type: "array",
                  minItems: 3,
                  maxItems: 3,
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      tagline: { type: "string" },
                      problem: { type: "string" },
                      solution: { type: "string" },
                      audience: { type: "string" },
                      firstSteps: {
                        type: "array",
                        items: { type: "string" },
                        minItems: 3,
                        maxItems: 3,
                      },
                      monetization: { type: "string" },
                      whyYou: { type: "string" },
                    },
                    required: [
                      "name",
                      "tagline",
                      "problem",
                      "solution",
                      "audience",
                      "firstSteps",
                      "monetization",
                      "whyYou",
                    ],
                    additionalProperties: false,
                  },
                },
              },
              required: ["ideas"],
              additionalProperties: false,
            },
          },
        },
      ],
      tool_choice: { type: "function", function: { name: "return_ideas" } },
    });

    const call = result?.choices?.[0]?.message?.tool_calls?.[0];
    if (!call) throw new Error("No structured response from model");
    const parsed = JSON.parse(call.function.arguments) as { ideas: BusinessIdea[] };
    return parsed;
  });

const chatInput = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(8000),
      }),
    )
    .min(1)
    .max(40),
  ideaContext: z.string().max(4000).optional().default(""),
});

export const chatMentor = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => chatInput.parse(data))
  .handler(async ({ data }) => {
    const system = `You are Spark, a warm, sharp startup mentor for young South African entrepreneurs — many of them graduates and youth from townships, rural, or underprivileged areas working through the 19.5% graduate unemployment rate, limited tech access, and tight capital. Coach the user through their idea: ask probing questions, challenge assumptions kindly, suggest scrappy next steps, and break down intimidating concepts (validation, MVPs, customer interviews, pricing) in plain language. Ground advice in the South African context: ZAR pricing, local channels (WhatsApp, Yoco, Payfast, SnapScan, Takealot, Facebook Marketplace), realities like load-shedding, data costs, and informal economy on-ramps, and pathways such as SEDA, NYDA, and youth skills programmes. Frame work as a way to build real skills and work experience, not just income. Format with markdown when helpful (bold, lists). Keep replies focused — 2-5 short paragraphs unless asked for depth.${data.ideaContext ? `\n\nContext about the user's idea:\n${data.ideaContext}` : ""}`;

    const result = await callGateway({
      model: "google/gemini-3-flash-preview",
      messages: [{ role: "system", content: system }, ...data.messages],
    });
    const reply = result?.choices?.[0]?.message?.content ?? "";
    return { reply };
  });