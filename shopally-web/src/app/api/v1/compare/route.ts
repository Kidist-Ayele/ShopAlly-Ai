//src/app/api/v1/compare/route.ts
import { getLanguage } from "@/lib/redux/languageBridge";
import { ComparisonResponse } from "@/types/Compare/Comparison";
import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.API_BASE;

export async function POST(
  req: NextRequest
): Promise<NextResponse<ComparisonResponse>> {
  try {
    const body = await req.json();
    const { products } = body;

    // ✅ Get deviceId and language from headers
    const deviceId = req.headers.get("x-device-id");
    const acceptLanguage = req.headers.get("accept-language") || "en-US";

    if (
      !products ||
      !Array.isArray(products) ||
      products.length < 2 ||
      products.length > 4
    ) {
      return NextResponse.json(
        {
          error: "Products array must have 2 to 4 items",
          data: { comparison: [] },
        },
        { status: 400 }
      );
    }

    if (!deviceId) {
      return NextResponse.json(
        { error: "Device ID is required", data: { comparison: [] } },
        { status: 400 }
      );
    }

    const langCode = getLanguage() || "en-US";

    const backendRes = await fetch(`${API_BASE}/api/v1/compare`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Device-ID": deviceId!,
        "Accept-Language": langCode,
      },
      body: JSON.stringify({
        products: products.map((p) => ({
          id: p.id,
          title: p.title,
          imageUrl: p.imageUrl,
          aiMatchPercentage: p.aiMatchPercentage,
          price: p.price,
          productRating: p.productRating,
          sellerScore: p.sellerScore,
          deliveryEstimate: p.deliveryEstimate,
          summaryBullets: p.summaryBullets,
          deeplinkUrl: p.deeplinkUrl,
        })),
      }),
    });

    const data = await backendRes.json();

    // 🔍 Log raw backend response for debugging
    console.log("🔍 Backend compare API response:", {
      status: backendRes.status,
      ok: backendRes.ok,
      data,
    });

    if (!backendRes.ok) {
      return NextResponse.json(
        {
          error: data?.error || "Failed to compare products",
          data: data?.data || { comparison: [] },
        },
        { status: backendRes.status }
      );
    }

    // ✅ Pass through backend response directly
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("POST /api/v1/compare error:", error);
    return NextResponse.json(
      { error: "Something went wrong", data: { comparison: [] } },
      { status: 500 }
    );
  }
}
