//src/lib/redux/api/chatApiSlice.ts
import {
  AddNewMessageResponse,
  CreateChatResponse,
  DeleteChatResponse,
  GetAllChatResponse,
  GetChatResponse,
} from "@/types/chat/chatResponses";
import {
  AddNewMessageRequest,
  CreateChatRequest,
  DeleteChatRequest,
  GetAllChatRequest,
  GetChatRequest,
} from "@/types/chat/chatTypes";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getLanguage } from "../languageBridge";

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/chat-history/v1/users",
    prepareHeaders: async (headers) => {
      const langCode = getLanguage();
      if (langCode) {
        headers.set("Accept-Language", langCode);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    getAllChat: builder.mutation<GetAllChatResponse, GetAllChatRequest>({
      query: ({ userEmail }) => ({
        url: `${userEmail}/chats`,
        method: "GET",
      }),
    }),
    getChat: builder.mutation<GetChatResponse, GetChatRequest>({
      query: ({ userEmail, chatId }) => ({
        url: `${userEmail}/chats/${chatId}`,
        method: "GET",
      }),
    }),
    createChat: builder.mutation<CreateChatResponse, CreateChatRequest>({
      query: ({ data, userEmail }) => ({
        url: `${userEmail}/chats`,
        method: "POST",
        body: data,
      }),
    }),
    addNewMessage: builder.mutation<
      AddNewMessageResponse,
      AddNewMessageRequest
    >({
      query: ({ data, userEmail, chatId }) => ({
        url: `${userEmail}/chats/${chatId}/messages`,
        method: "POST",
        body: data,
      }),
    }),
    deleteChat: builder.mutation<DeleteChatResponse, DeleteChatRequest>({
      query: ({ userEmail, chatId }) => ({
        url: `${userEmail}/chats/${chatId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetAllChatMutation,
  useGetChatMutation,
  useCreateChatMutation,
  useAddNewMessageMutation,
  useDeleteChatMutation,
} = chatApi;
