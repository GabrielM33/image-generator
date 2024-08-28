import { NextResponse } from 'next/server';
import Replicate from "replicate";

export async function POST(request: Request) {
  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });

  const body = await request.json();
  const { prompt } = body;

  try {
    const output = await replicate.run(
      "adirik/flux-cinestill:216a43b9975de9768114644bbf8cd0cba54a923c6d0f65adceaccfc9383a938f",
      {
        input: {
          model: "dev",
          prompt: prompt,
          lora_scale: 0.6,
          num_outputs: 1,
          aspect_ratio: "1:1",
          output_format: "webp",
          guidance_scale: 3.5,
          output_quality: 80,
          extra_lora_scale: 0.8,
          num_inference_steps: 28
        }
      }
    );

    if (!output || !Array.isArray(output) || output.length === 0) {
      throw new Error("No output generated from Replicate");
    }

    return NextResponse.json({ imageUrl: output[0] });
  } catch (error) {
    console.error("Detailed error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unknown error occurred" },
      { status: 500 }
    );
  }
}