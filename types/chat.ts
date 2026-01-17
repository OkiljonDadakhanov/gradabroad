export interface ChatMessage {
  id: number;
  application_id: number;
  sender_type: "student" | "university";
  sender_id: number;
  sender_name: string;
  text: string;
  created_at: string;
  read: boolean;
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
}
