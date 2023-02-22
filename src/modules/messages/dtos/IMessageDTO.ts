export interface IMessageDTO {
  id: string;
  senderId: string;
  addresseeId: string;
  text: string;
  subject: string;
  replyingTo: string;
}