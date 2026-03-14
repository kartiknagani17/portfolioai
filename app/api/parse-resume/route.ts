import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

function getGenAI() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("Missing GEMINI_API_KEY");
  return new GoogleGenerativeAI(key);
}

const PortfolioDataSchema = z.object({
  personal: z.object({
    fullName: z.string(),
    professionalTitle: z.string(),
    email: z.string().optional().default(""),
    phone: z.string().optional().default(""),
    location: z.string().optional().default(""),
    bio: z.string().optional().default(""),
    linkedinUrl: z.string().optional().default(""),
    githubUrl: z.string().optional().default(""),
    websiteUrl: z.string().optional().default(""),
    profilePhotoUrl: z.string().nullable().default(null),
  }),
  experience: z
    .array(
      z.object({
        companyName: z.string(),
        roleTitle: z.string(),
        startDate: z.string(),
        endDate: z.string().optional().default(""),
        isCurrent: z.boolean().default(false),
        location: z.string().optional().default(""),
        description: z.string().optional().default(""),
      })
    )
    .default([]),
  projects: z
    .array(
      z.object({
        projectName: z.string(),
        description: z.string(),
        techStack: z.array(z.string()).default([]),
        liveUrl: z.string().optional().default(""),
        githubUrl: z.string().optional().default(""),
      })
    )
    .default([]),
  skills: z
    .array(
      z.object({
        name: z.string(),
        category: z.string().optional().default(""),
      })
    )
    .default([]),
  education: z
    .array(
      z.object({
        institution: z.string(),
        degree: z.string(),
        fieldOfStudy: z.string().optional().default(""),
        startYear: z.string().optional().default(""),
        endYear: z.string().optional().default(""),
      })
    )
    .default([]),
  certifications: z
    .array(
      z.object({
        name: z.string(),
        issuer: z.string(),
        date: z.string().optional().default(""),
        relevance: z.string().optional().default(""),
      })
    )
    .optional()
    .default([]),
  languages: z
    .array(
      z.object({
        language: z.string(),
        proficiency: z.string(),
      })
    )
    .optional()
    .default([]),
  interests: z.array(z.string()).optional().default([]),

  // AI-generated personality fields — always present
  tagline: z.string().default(""),
  careerStory: z.string().default(""),
  workStyle: z.string().default(""),
  lookingFor: z.string().default(""),
});

async function extractPdfWithPdfjsDist(data: Uint8Array): Promise<string> {
  const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const doc = await pdfjsLib.getDocument({ data, useSystemFonts: true }).promise;
  const pages: string[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    pages.push(
      content.items
        .filter((item: any) => "str" in item)
        .map((item: any) => item.str)
        .join(" ")
    );
  }
  return pages.join("\n");
}

async function extractTextFromFile(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());

  if (file.name.endsWith(".pdf") || file.type === "application/pdf") {
    try {
      const pdfParse = (await import("pdf-parse")).default;
      const result = await pdfParse(buffer);
      return result.text;
    } catch (primaryErr) {
      console.warn(`${LOG} pdf-parse failed, trying pdfjs-dist fallback:`, primaryErr);
      return extractPdfWithPdfjsDist(new Uint8Array(buffer));
    }
  }

  if (file.name.endsWith(".docx") || file.type.includes("word")) {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  throw new Error("Unsupported file type. Please upload a PDF or DOCX file.");
}

const MODELS_TO_TRY = ["gemini-2.5-flash"];

async function callGeminiWithRetry(
  genAI: InstanceType<typeof GoogleGenerativeAI>,
  prompt: string,
  maxRetries = 3
): Promise<string> {
  let lastError: unknown;

  for (const modelName of MODELS_TO_TRY) {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        return result.response.text();
      } catch (err: unknown) {
        lastError = err;
        const msg = err instanceof Error ? err.message : String(err);
        const is429 = msg.includes("429") || msg.includes("quota") || msg.includes("Too Many Requests");
        const isRateLimit = msg.includes("rate") || msg.includes("RESOURCE_EXHAUSTED");

        if (is429 || isRateLimit) {
          const waitMs = Math.min(2000 * Math.pow(2, attempt), 30000);
          console.warn(`Gemini ${modelName} rate-limited (attempt ${attempt + 1}), retrying in ${waitMs}ms...`);
          await new Promise((r) => setTimeout(r, waitMs));
          continue;
        }
        break;
      }
    }
  }

  throw lastError;
}

const LOG = "[PortfolioAI]";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      console.warn(`${LOG} parse-resume: no file in request`);
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    console.log(`${LOG} parse-resume: start`, { filename: file.name, size: file.size, type: file.type });
    const text = await extractTextFromFile(file);
    console.log(`${LOG} parse-resume: extracted text length`, text?.length ?? 0);

    if (!text || text.trim().length < 50) {
      console.warn(`${LOG} parse-resume: text too short or empty`);
      return NextResponse.json(
        { error: "Could not extract text from file" },
        { status: 400 }
      );
    }

    console.log(`${LOG} parse-resume: calling Gemini`);
    const genAI = getGenAI();

    const prompt = `
Extract all information from this resume and return a JSON object.
Return JSON only. No markdown. No explanation. No backticks.

IMPORTANT: Only include a section if the resume actually contains that information.
- If no certifications exist in the resume, return an empty array for "certifications".
- If no spoken languages are mentioned, return an empty array for "languages".
- If no interests/hobbies are mentioned, return an empty array for "interests".

Required structure:
{
  "personal": {
    "fullName": "full name of the person",
    "professionalTitle": "their current or most recent job title",
    "email": "email address or empty string",
    "phone": "phone number or empty string",
    "location": "city, country or empty string",
    "bio": "a 2-4 sentence professional summary — use their own words if available, otherwise write one from their experience",
    "linkedinUrl": "linkedin profile url or empty string",
    "githubUrl": "github profile url or empty string",
    "websiteUrl": "personal website or portfolio url or empty string",
    "profilePhotoUrl": null
  },
  "experience": [
    {
      "companyName": "company name",
      "roleTitle": "job title",
      "startDate": "month year e.g. Jan 2022",
      "endDate": "month year or empty string if current",
      "isCurrent": true or false,
      "location": "city or Remote or empty string",
      "description": "3-6 bullet points as a paragraph covering achievements and responsibilities"
    }
  ],
  "projects": [
    {
      "projectName": "project name",
      "description": "what was built, your contribution, and outcomes",
      "techStack": ["tech1", "tech2"],
      "liveUrl": "url or empty string",
      "githubUrl": "url or empty string"
    }
  ],
  "skills": [
    { "name": "skill name", "category": "one of: Languages, Frontend, Backend, Design, Tools, Cloud, Databases, Soft Skills, Other" }
  ],
  "education": [
    {
      "institution": "university or school name",
      "degree": "degree type e.g. Bachelor of Science",
      "fieldOfStudy": "major or field of study",
      "startYear": "year or empty string",
      "endYear": "year or empty string if current"
    }
  ],
  "certifications": [
    {
      "name": "certification name e.g. AWS Certified Solutions Architect",
      "issuer": "issuing organization e.g. Amazon Web Services",
      "date": "month year obtained or empty string",
      "relevance": "one line on what this certifies, or empty string"
    }
  ],
  "languages": [
    {
      "language": "language name e.g. Spanish",
      "proficiency": "one of: Native, Fluent, Professional, Conversational, Basic"
    }
  ],
  "interests": ["interest1", "interest2", "interest3"],

  "tagline": "One punchy, memorable sentence that captures who this person is professionally. Make it specific to them — avoid generic phrases. E.g. 'The engineer who ships before others finish planning.' or 'Turning ambiguous briefs into brands people tattoo on their arms.'",
  "careerStory": "2–4 sentences telling their career as a narrative arc. Where they started, what drove them forward, and where they stand now. Write in second person ('You started as...') or third person ('She began her career...'). Make it compelling, not a list of facts.",
  "workStyle": "2–3 sentences describing how they think and work, inferred from patterns in their career — the types of problems they gravitate toward, their approach to craft, and what makes them distinct. This is not a skill list. It's a personality read.",
  "lookingFor": "1–3 sentences on what they want next, inferred from the recency and trajectory of their roles. Are they ready to lead? Looking to go deeper technically? Want to build something from scratch? Be specific and honest to the data."
}

RESUME TEXT:
${text}
`;

    const responseText = await callGeminiWithRetry(genAI, prompt);

    const cleaned = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);
    const validated = PortfolioDataSchema.parse(parsed);
    console.log(`${LOG} parse-resume: success`, { name: validated.personal?.fullName });

    return NextResponse.json(validated);
  } catch (error: unknown) {
    console.error(`${LOG} parse-resume error:`, error);
    const msg = error instanceof Error ? error.message : String(error);
    const is429 = msg.includes("429") || msg.includes("quota") || msg.includes("Too Many Requests");

    if (is429) {
      return NextResponse.json(
        {
          error:
            "Gemini API quota exceeded. Your free-tier daily limit has been reached. Please wait a few minutes and try again, or add billing to your Google AI project at https://aistudio.google.com.",
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        error: msg || "Failed to parse resume",
      },
      { status: 500 }
    );
  }
}
