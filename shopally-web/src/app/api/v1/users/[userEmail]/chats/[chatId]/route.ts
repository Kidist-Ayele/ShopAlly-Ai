// src/app/api/v1/users/[userEmail]/chats/[chatId]/route.ts
import {
  DeleteChatResponse,
  GetChatResponse,
} from "@/types/chat/chatResponses";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.API_BASE;

// ✅ GET /users/{userEmail}/chats/{chatId} → Fetch a single chat
export async function GET(
  _req: NextRequest,
  { params }: { params: { userEmail: string; chatId: string } }
): Promise<NextResponse<GetChatResponse>> {
  try {
    const { userEmail, chatId } = params;

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
      `${API_BASE}/users/${encodeURIComponent(
        userEmail
      )}/chats/${encodeURIComponent(chatId)}`,
      {
        headers: {
          "X-Device-ID": deviceId,
          "Accept-Language": langCode,
        },
      }
    );

    const data = (await backendRes.json()) as GetChatResponse;
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    console.error("Get chat failed:", error);
    return NextResponse.json(
      {
        data: null,
        error: { code: "INTERNAL", message: "Failed to fetch chat" },
      },
      { status: 500 }
    );
  }
}

// ✅ DELETE /users/{userEmail}/chats/{chatId} → Delete a chat
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { userEmail: string; chatId: string } }
): Promise<NextResponse<DeleteChatResponse>> {
  try {
    const { userEmail, chatId } = params;

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
      `${API_BASE}/users/${encodeURIComponent(
        userEmail
      )}/chats/${encodeURIComponent(chatId)}`,
      {
        method: "DELETE",
        headers: {
          "X-Device-ID": deviceId,
          "Accept-Language": langCode,
        },
      }
    );

    // ✅ Backend returns 204 No Content → we return same with empty body
    if (backendRes.status === 204) {
      return NextResponse.json({ data: null, error: null }, { status: 204 });
    }

    const data = (await backendRes.json()) as DeleteChatResponse;
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    console.error("Delete chat failed:", error);
    return NextResponse.json(
      {
        data: null,
        error: { code: "INTERNAL", message: "Failed to delete chat" },
      },
      { status: 500 }
    );
  }
}
