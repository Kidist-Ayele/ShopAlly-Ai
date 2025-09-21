import { ChatProduct } from "@/types/chat/chatTypes";

export type UiChatMessage =
  | {
      id: string;
      type: "user";
      content: string;
      timestamp: number;
    }
  | {
      id: string;
      type: "ai";
      content: string;
      timestamp: number;
      products: ChatProduct[];
    };
