"use client";

import { useDarkMode } from "@/app/components/ProfileComponents/DarkModeContext";
import { useLanguage } from "@/hooks/useLanguage";
import {
  useDeleteChatMutation,
  useGetAllChatMutation,
  useGetChatMutation,
} from "@/lib/redux/api/chatApiSlice";
import { ChatSession } from "@/types/chat/chatTypes";
import { UiChatMessage } from "@/types/chat/uiTypes";
import { Loader2, MessageSquare, PlusCircle, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type ApiChatMessage = ChatSession["messages"][0];

// Client-side date renderer to avoid hydration errors
function ClientDate({ iso }: { iso: string }) {
  const [dateString, setDateString] = useState("");
  useEffect(() => {
    setDateString(new Date(iso).toLocaleString());
  }, [iso]);
  return <p className="text-xs text-gray-400">{dateString}</p>;
}

export default function ChatHistoryUI() {
  const { isDarkMode } = useDarkMode();
  const { t } = useLanguage();
  const router = useRouter();
  const { data: session } = useSession(); // 🔹 OAuth session
  const [getChatById] = useGetChatMutation();
  const [deleteChat] = useDeleteChatMutation();

  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const [getAllChat, { data, isLoading, isError }] = useGetAllChatMutation();

  useEffect(() => {
    if (session?.user?.email) {
      getAllChat({ userEmail: session.user.email });
    }
  }, [session?.user?.email, getAllChat]);

  const chats = data?.data ?? [];

  const handleDeleteChat = async (chatId: string) => {
    if (!session?.user?.email) {
      console.error("❌ No user email in session");
      return;
    }

    try {
      setDeleting(chatId);

      await deleteChat({
        userEmail: session.user.email,
        chatId,
      }).unwrap();

      // ✅ Refresh chats list after delete
      await getAllChat({ userEmail: session.user.email });

      // Optional: if you want full page reload instead:
      // router.refresh();

      setDeleting(null);
    } catch (err) {
      console.error("❌ Failed to delete chat:", err);
      setDeleting(null);
    }
  };

  const handleNewChat = () => {
    // ✅ Clear both conversation and chatId
    localStorage.removeItem("conversation");
    localStorage.removeItem("chatId");

    // Optionally, navigate to home without a chat selected
    router.push("/home");
  };

  const handleClickChat = async (chatId: string) => {
    try {
      // Clear old conversation
      localStorage.removeItem("conversation");

      if (!session?.user?.email) {
        console.error("❌ No user email in session");
        return;
      }

      const res = await getChatById({
        userEmail: session.user.email,
        chatId,
      }).unwrap();

      // ✅ Use ChatSession from chatTypes
      const messages: ApiChatMessage[] = res.data ? res.data.messages : [];

      // 🔹 Transform: user_prompt → user message, products → ai message
      const formatted: UiChatMessage[] = messages.flatMap((m, idx) => {
        const pair: UiChatMessage[] = [];

        if (m.user_prompt) {
          pair.push({
            id: `user-${idx}`,
            type: "user",
            content: m.user_prompt,
            timestamp: new Date(m.created_at).getTime(),
          });
        }

        if (m.products && m.products.length > 0) {
          pair.push({
            id: `ai-${idx}`,
            type: "ai",
            content: `Found ${m.products.length} products for "${m.user_prompt}"`,
            products: m.products,
            timestamp: new Date(m.created_at).getTime(),
          });
        }

        return pair;
      });

      // ✅ Save both conversation + chatId
      localStorage.setItem("conversation", JSON.stringify(formatted));
      localStorage.setItem("chatId", chatId);

      router.push(`/home?chat=${chatId}`);
    } catch (err) {
      console.error("❌ Failed to load chat by id:", err);
    }
  };

  return (
    <main
      className={`min-h-screen pb-24 px-4 sm:px-6 lg:px-8 ${
        isDarkMode ? "bg-[#090C11] text-white" : "bg-white text-black"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center py-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold">{t("Your Chat History")}</h1>
        <button
          onClick={handleNewChat}
          disabled={creating}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black rounded-xl font-medium shadow-md hover:bg-yellow-500 disabled:opacity-70"
        >
          {creating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <PlusCircle className="w-4 h-4" />
          )}
          {t("New Chat")}
        </button>
      </div>

      {/* Chat List */}
      <div className="max-w-4xl mx-auto">
        {!session ? (
          <p className="text-center text-gray-400 py-12">
            {t("Please sign in to view your chats.")}
          </p>
        ) : isLoading ? (
          <p className="text-center text-gray-400 py-12 flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            {t("Loading chats...")}
          </p>
        ) : isError ? (
          <p className="text-center text-red-500 py-12">
            {t("Failed to load chats.")}
          </p>
        ) : chats.length === 0 ? (
          <p className="text-center text-gray-400 py-12">
            {t("No chat history yet. Start a new chat!")}
          </p>
        ) : (
          <div className="grid gap-4">
            {chats.map((chat) => (
              <div
                key={chat.chat_id}
                className={`flex justify-between items-center p-4 rounded-xl shadow-md cursor-pointer transition ${
                  isDarkMode
                    ? "bg-gray-800 hover:bg-gray-700"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
                onClick={() => handleClickChat(chat.chat_id)}
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-yellow-400" />
                  <div>
                    <h2 className="font-semibold">{chat.chat_title}</h2>
                    <ClientDate iso={chat.last_updated} />
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // ✅ prevent opening chat
                    handleDeleteChat(chat.chat_id);
                  }}
                  disabled={deleting === chat.chat_id}
                  className="p-2 rounded-full hover:bg-red-500/10 text-red-500"
                >
                  {deleting === chat.chat_id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
