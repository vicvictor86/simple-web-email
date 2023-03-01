export interface ICreateUserMessagesDTO {
  message_id: string;
  sender_id: string;
  addressee_id: string;
  replying_to_id?: string;
  forwarding_to_id?: string;
  read: boolean;
}