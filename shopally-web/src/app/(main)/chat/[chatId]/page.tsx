"use client";

import { useParams } from "next/navigation";

export default function ChatPage() {
  const { chatId } = useParams();

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold">Chat Session {chatId}</h1>
      <div className="mt-4 bg-gray-50 p-6 rounded-xl shadow">
        <p className="text-gray-600">
          Here you’ll render messages for this chat (fetch with API later).
        </p>
      </div>
    </div>
  );
}
