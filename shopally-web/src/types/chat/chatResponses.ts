import { ChatSession } from "./chatTypes";

export interface GetAllChatResponse {
  data: ChatSession[] | null;
  error?: {
    code: string;
    message: string;
  };
}

export interface GetChatResponse {
  data: ChatSession | null;
  error?: {
    code: string;
    message: string;
  };
}

export interface CreateChatResponse {
  data: ChatSession | null;
  error?: {
    code: string;
    message: string;
  };
}

export interface AddNewMessageResponse {
  data: null;
  error?: {
    code: string;
    message: string;
  };
}

export interface DeleteChatResponse {
  data: null;
  error?: {
    code: string;
    message: string;
  } | null;
}
