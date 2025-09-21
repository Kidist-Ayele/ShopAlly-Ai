//src/app/(main)/history/page.tsx
"use client";

import ChatHistoryUI from "@/app/components/Chat/ChatHistoryUI";
import Sidebar from "@/app/components/Sidebar";

export default function HistoryPage() {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar activePage="history" />

      {/* Main Content */}
      <div className="flex-1 ml-16 lg:ml-64">
        <ChatHistoryUI />
      </div>
    </div>
  );
}
