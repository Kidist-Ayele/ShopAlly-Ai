export interface GetAllChatRequest {
  userEmail: string;
}

export interface GetChatRequest {
  userEmail: string;
  chatId: string;
}

export interface CreateChatRequest {
  userEmail: string;
  data: {
    chat_title: string;
  };
}

export interface AddNewMessageRequest {
  userEmail: string;
  chatId: string;
  data: {
    user_prompt: string;
    products: ChatProduct[];
  };
}

export interface DeleteChatRequest {
  userEmail: string;
  chatId: string;
}

// Response schema from API
export interface ChatProduct {
  id: string;
  title: string;
  imageUrl: string;
  aiMatchPercentage?: number;
  price: {
    etb?: number;
    usd?: number;
    fxTimestamp: string;
  };
  productRating?: number;
  sellerScore?: number;
  deliveryEstimate?: string;
  description?: string; // ✅ optional
  productSmallImageUrls?: string[]; // ✅ optional
  numberSold?: number; // ✅ optional
  summaryBullets?: string[];
  deeplinkUrl: string;
  taxRate?: number; // ✅ optional
  discount?: number; // ✅ optional
  removeProduct?: boolean;
}

export interface ChatMessage {
  user_prompt: string;
  created_at: string;
  products: ChatProduct[];
}

export interface ChatSession {
  chat_id: string;
  chat_title: string;
  start_time: string;
  last_updated: string;
  messages: ChatMessage[];
}
