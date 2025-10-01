// src/app/api/v1/image/search/route.ts
import { ImageSearchResponse } from "@/types/ImageSearch/ImageSearchResponse";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.API_BASE;

export async function POST(
  req: NextRequest
): Promise<NextResponse<ImageSearchResponse>> {
  try {
    // grab cookies
    const cookieStore = await cookies();
    const deviceId = cookieStore.get("deviceId")?.value;
    const langCode = cookieStore.get("lang")?.value || "en";

    if (!deviceId) {
      return NextResponse.json<ImageSearchResponse>(
        {
          data: null,
          error: {
            code: "MISSING_DEVICE_ID",
            message:
              "Device ID not available yet. Please wait for notifications setup.",
          },
        },
        { status: 409 }
      );
    }

    // parse incoming form data from client
    const formData = await req.formData();
    const image = formData.get("image");

    if (!image || !(image instanceof Blob)) {
      return NextResponse.json<ImageSearchResponse>(
        {
          data: null,
          error: {
            code: "INVALID_INPUT",
            message: "Missing or invalid image file",
          },
        },
        { status: 400 }
      );
    }

    // build new form data for backend
    const backendForm = new FormData();
    backendForm.append("image", image);

    const priceMaxETB = formData.get("priceMaxETB");
    const minRating = formData.get("minRating");
    const confidenceThreshold = formData.get("confidenceThreshold");

    if (priceMaxETB) backendForm.append("priceMaxETB", String(priceMaxETB));
    if (minRating) backendForm.append("minRating", String(minRating));
    if (confidenceThreshold)
      backendForm.append("confidenceThreshold", String(confidenceThreshold));

    // forward request to backend
    const backendRes = await fetch(`${API_BASE}/api/v1/image/search`, {
      method: "POST",
      headers: {
        "X-Device-ID": deviceId,
        // "X-Device-ID": "trial-token9", // TODO: remove this line
        "Accept-Language": langCode,
      },
      body: backendForm,
    });

    const contentType = backendRes.headers.get("content-type") || "";
    const rawText = await backendRes.text();

    console.log("🖼️ Backend status:", backendRes.status);
    console.log("🖼️ Backend content-type:", contentType);
    console.log("🖼️ Backend raw response:", rawText.slice(0, 300));

    let data: ImageSearchResponse;
    try {
      data = JSON.parse(rawText) as ImageSearchResponse;
    } catch (err) {
      console.error("❌ Failed to parse JSON:", err);
      return NextResponse.json<ImageSearchResponse>(
        {
          data: null,
          error: {
            code: "INVALID_JSON",
            message: "Backend returned invalid JSON",
          },
        },
        { status: 500 }
      );
    }

    if (!backendRes.ok) {
      return NextResponse.json<ImageSearchResponse>(
        {
          data: typeof data?.data === "string" ? data.data : null,
          error: data?.error || {
            code: "BACKEND_ERROR",
            message: "Failed to perform image search",
          },
        },
        { status: backendRes.status }
      );
    }

    return NextResponse.json<ImageSearchResponse>(data, { status: 200 });
  } catch (error) {
    console.error("POST /api/v1/image/search error:", error);
    return NextResponse.json<ImageSearchResponse>(
      {
        data: null,
        error: { code: "UNKNOWN_ERROR", message: "Something went wrong" },
      },
      { status: 500 }
    );
  }
}
