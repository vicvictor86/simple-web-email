export interface MessageDTO {
  id: string;
  sender: string;
  addressee: string;
  text: string;
  subject: string;
  replyingTo: string;
}