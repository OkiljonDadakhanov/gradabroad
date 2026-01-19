export interface ChatMessage {
  id: number;
  text: string;
  file: string | null;
  file_name: string | null;
  file_type: string | null;
  signed_file_url: string | null;
  sender: number;
  sender_email: string;
  sender_name: string;
  sender_account_type: "student" | "university";
  created_at: string;
  is_read: boolean;
  read_at: string | null;
}

// Alias for backwards compatibility
export type { ChatMessage as Message };

export interface ChatThreadStatus {
  exists: boolean;
  is_open: boolean;
  thread_id: number | null;
  unread_count: number;
  can_send: boolean;
}

export interface ChatRoom {
  application_id: number;
  student_name: string;
  university_name: string;
  last_message?: ChatMessage;
  unread_count: number;
}

export interface SendMessageData {
  text: string;
  file?: File;
}

// WebSocket message types
export interface WsNewMessage {
  type: "new_message";
  message: ChatMessage;
}

export interface WsTypingIndicator {
  type: "typing";
  user_id: number;
  user_type: "student" | "university";
  is_typing: boolean;
}

export interface WsMessagesRead {
  type: "messages_read";
  count?: number;
  message_ids?: number[];
}

export interface WsError {
  type: "error";
  message: string;
}

export interface WsPresenceUpdate {
  type: "presence_update";
  user_id: number;
  user_type: "student" | "university";
  is_online: boolean;
  last_seen: string | null;
}

export type WsIncomingMessage = WsNewMessage | WsTypingIndicator | WsMessagesRead | WsError | WsPresenceUpdate;
