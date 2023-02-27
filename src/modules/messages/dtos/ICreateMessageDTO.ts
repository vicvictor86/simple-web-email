export interface ICreateMessageDTO {
  text: string;
  subject: string;
  replyingTo: string;
  forwardingTo: string;
}