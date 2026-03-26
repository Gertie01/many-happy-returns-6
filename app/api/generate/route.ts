import { NextResponse } from 'next/server';

const MODEL_ID = "stable-diffusion-xl-base-1.0";
const INTERNAL_API_URL = process.env.INTERNAL_API_URL;
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY;

// Internal caching to avoid redundant heavy compute for same prompts
const cache = new Map();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, modelId } = body;

    // Abuse Protection: Validate input existence
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: "Invalid prompt provided" }, { status: 400 });
    }

    // Model ID Validation Guardrail
    if (modelId !== MODEL_ID) {
      return NextResponse.json({ error: "Unauthorized model access" }, { status: 403 });
    }

    // Check Cache
    if (cache.has(prompt)) {
      return NextResponse.json({ url: cache.get(prompt), cached: true });
    }

    /**
    INTERNAL API LOGIC
    This section interacts with the real internal image generation microservice.
     */

    const response = await fetch(`${INTERNAL_API_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${INTERNAL_API_KEY}`,
      },
      body: JSON.stringify({
        prompt,
        model: MODEL_ID,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    const imageUrl = data.url;

    // Store in internal cache for aggressive performance
    cache.set(prompt, imageUrl);

    return NextResponse.json({
      success: true,
      url: imageUrl,
      model: MODEL_ID,
      timestamp: Date.now()
    });

  } catch (error) {
    console.error("Generation Error:", error);
    return NextResponse.json({ error: "Internal processing failed", details: error instanceof Error ? error.message : 'Unknown' }, { status: 500 });
  }
}
