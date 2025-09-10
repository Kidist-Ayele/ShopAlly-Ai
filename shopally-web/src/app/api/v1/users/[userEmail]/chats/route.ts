// src/app/api/v1/users/[userEmail]/chats/route.ts
import {
  CreateChatResponse,
  GetAllChatResponse,
} from "@/types/chat/chatResponses";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.API_BASE;

// ✅ POST /users/{userEmail}/chats → Create a new chat
export async function POST(
  req: NextRequest,
  { params }: { params: { userEmail: string } }
): Promise<NextResponse<CreateChatResponse>> {
  try {
    const { userEmail } = params;
    const body = await req.json();

    // Get deviceId and language from cookies
    const cookieStore = await cookies();
    const deviceId = cookieStore.get("deviceId")?.value;
    const langCode = cookieStore.get("lang")?.value || "en";

    if (!deviceId) {
      return NextResponse.json(
        {
          data: null,
          error: { code: "MISSING_DEVICE", message: "Device ID is required" },
        },
        { status: 400 }
      );
    }

    const backendRes = await fetch(
      `${API_BASE}/users/${encodeURIComponent(userEmail)}/chats`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Device-ID": deviceId,
          "Accept-Language": langCode,
        },
        body: JSON.stringify(body),
      }
    );

    const data = (await backendRes.json()) as CreateChatResponse;
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    console.error("Create chat failed:", error);
    return NextResponse.json(
      {
        data: null,
        error: { code: "INTERNAL", message: "Failed to create chat" },
      },
      { status: 500 }
    );
  }
}

// ✅ GET /users/{userEmail}/chats → Get all chats
export async function GET(
  _req: NextRequest,
  { params }: { params: { userEmail: string } }
): Promise<NextResponse<GetAllChatResponse>> {
  try {
    const { userEmail } = params;

    // Get deviceId and language from cookies
    const cookieStore = await cookies();
    const deviceId = cookieStore.get("deviceId")?.value;
    const langCode = cookieStore.get("lang")?.value || "en";

    if (!deviceId) {
      return NextResponse.json(
        {
          data: [],
          error: {
            code: "MISSING_DEVICE",
            message:
              "Device ID not available yet. Please wait for notifications setup.",
          },
        },
        { status: 409 }
      );
    }

    const backendRes = await fetch(
      `${API_BASE}/users/${encodeURIComponent(userEmail)}/chats`,
      {
        headers: {
          "X-Device-ID": deviceId,
          "Accept-Language": langCode,
        },
      }
    );

    const data = (await backendRes.json()) as GetAllChatResponse;
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    console.error("Get all chats failed:", error);
    return NextResponse.json(
      {
        data: [],
        error: { code: "INTERNAL", message: "Failed to retrieve chats" },
      },
      { status: 500 }
    );
  }
}
