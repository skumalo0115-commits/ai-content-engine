import { NextResponse } from "next/server";
import { generateContent, validateGeneratePayload } from "@/app/lib/generator";
import type { GeneratePayload } from "@/app/lib/types";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as GeneratePayload;
    validateGeneratePayload(payload);
    const response = await generateContent(payload);

    return NextResponse.json(response);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong while generating content.";

    return NextResponse.json(
      {
        error: message,
      },
      { status: 400 },
    );
  }
}
