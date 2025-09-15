// src/app/api/chat-history/v1/users/[userEmail]/chats/[chatId]/messages/route.ts
import { AddNewMessageResponse } from "@/types/chat/chatResponses";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.CHAT_HISTORY_API_BASE;

// ✅ POST /users/{userEmail}/chats/{chatId}/messages → Add a new message
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ userEmail: string; chatId: string }> } // 🔹 change here
): Promise<NextResponse<AddNewMessageResponse>> {
  try {
    const { userEmail, chatId } = await context.params;
    const body = await req.json();

    const cookieStore = await cookies();
    const deviceId = cookieStore.get("deviceId")?.value;
    const langCode = cookieStore.get("lang")?.value || "en";

    if (!deviceId) {
      return NextResponse.json(
        {
          data: null,
          error: {
            code: "MISSING_DEVICE",
            message: "Device ID is required",
          },
        },
        { status: 400 }
      );
    }

    const backendRes = await fetch(
      `${API_BASE}/api/chat-history/v1/users/${encodeURIComponent(
        userEmail
      )}/chats/${encodeURIComponent(chatId)}/messages`,
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

    const data = (await backendRes.json()) as AddNewMessageResponse;
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    console.error("Add new message failed:", error);
    return NextResponse.json(
      {
        data: null,
        error: { code: "INTERNAL", message: "Failed to add new message" },
      },
      { status: 500 }
    );
  }
}
