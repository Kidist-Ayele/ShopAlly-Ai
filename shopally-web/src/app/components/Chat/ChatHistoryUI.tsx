"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, Trash2, MessageSquare, Loader2 } from "lucide-react";
import { useDarkMode } from "@/app/components/ProfileComponents/DarkModeContext";
import { useLanguage } from "@/hooks/useLanguage";

// Client-side date renderer to avoid hydration errors
function ClientDate({ iso }: { iso: string }) {
  const [dateString, setDateString] = useState("");
  useEffect(() => {
    setDateString(new Date(iso).toLocaleString());
  }, [iso]);
  return <p className="text-xs text-gray-400">{dateString}</p>;
}

// Dummy chat data for UI
const dummyChats = [
  { chat_id: "1", chat_title: "Chat One", last_updated: new Date().toISOString() },
  { chat_id: "2", chat_title: "Chat Two", last_updated: new Date().toISOString() },
  { chat_id: "3", chat_title: "Chat Three", last_updated: new Date().toISOString() },
];

export default function ChatHistoryUI() {
  const { isDarkMode } = useDarkMode();
  const { t } = useLanguage();
  const router = useRouter();

  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleNewChat = () => {
    setCreating(true);
    setTimeout(() => {
      const newChatId = String(Date.now());
      setCreating(false);
      router.push(`/home?chat=${newChatId}`);
    }, 300);
  };

  const handleClickChat = (chatId: string) => {
    router.push(`/home?chat=${chatId}`);
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
        {dummyChats.length === 0 ? (
          <p className="text-center text-gray-400 py-12">
            {t("No chat history yet. Start a new chat!")}
          </p>
        ) : (
          <div className="grid gap-4">
            {dummyChats.map((chat) => (
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
                    e.stopPropagation();
                    setDeleting(chat.chat_id);
                    setTimeout(() => setDeleting(null), 500);
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
