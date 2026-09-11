import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { AI_CATEGORIES, DIFFICULTIES, LENGTHS } from "@/data/aiCategories";
import { sanitizeText } from "@/core/adaptive/exerciseGenerator";

const Input = z.object({
  categoryId: z.string().min(1),
  topic: z.string().max(80).optional(),
  difficulty: z.enum(["easy", "medium", "hard", "expert"]),
  length: z.enum(["short", "medium", "long"]),
  focusKeys: z.string().max(40).optional(),
});

const DEFAULT_MODEL = "openai/gpt-4o-mini";

export const generateAiLesson = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => Input.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env["OPENROUTER_API_KEY"];
    if (!apiKey) {
      throw new Error(
        "AI lessons are not configured yet — an OpenRouter API key needs to be saved first.",
      );
    }

    const category = AI_CATEGORIES.find((item) => item.id === data.categoryId);
    if (!category) throw new Error("Unknown category.");
    const difficulty = DIFFICULTIES.find((item) => item.id === data.difficulty)!;
    const length = LENGTHS.find((item) => item.id === data.length)!;

    const prompt = [
      `Write typing-practice text about ${data.topic?.trim() || category.label}.`,
      `Style: ${category.prompt}.`,
      `Difficulty: ${difficulty.label} — ${difficulty.hint}.`,
      `Length: about ${length.chars} characters (do not go far over).`,
      data.focusKeys
        ? `Use the letters "${data.focusKeys}" much more often than normal, naturally.`
        : "",
      "Rules: plain ASCII characters only, no emoji, no markdown, no headings, no quotes around the text, no line breaks. Return only the practice text.",
    ]
      .filter(Boolean)
      .join(" ");

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "X-Title": "Cobra",
      },
      body: JSON.stringify({
        model: process.env["OPENROUTER_MODEL"] || DEFAULT_MODEL,
        messages: [
          {
            role: "system",
            content:
              "You write short, safe, age-appropriate typing practice passages. Output plain text only.",
          },
          { role: "user", content: prompt },
        ],
        max_tokens: 700,
        temperature: 0.9,
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      if (response.status === 401) throw new Error("The OpenRouter API key was rejected.");
      if (response.status === 429) throw new Error("OpenRouter is rate limiting — try again shortly.");
      if (response.status === 402) throw new Error("The OpenRouter account is out of credit.");
      throw new Error(`OpenRouter error ${response.status}: ${detail.slice(0, 200)}`);
    }

    const payload = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const raw = payload.choices?.[0]?.message?.content ?? "";
    const text = sanitizeText(raw, length.chars + 200);
    if (text.length < 40) throw new Error("The AI returned an empty passage — please try again.");

    return {
      text,
      title: data.topic?.trim() || category.label,
      category: category.label,
      difficulty: difficulty.label,
    };
  });
