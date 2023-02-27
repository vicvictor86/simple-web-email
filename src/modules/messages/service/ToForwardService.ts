import { messages, users } from "../../../shared/infra/http/server";
import { IMessageDTO } from "../dtos/ICreateMessageDTO";

interface Request {
  senderId: string;
  addresseeId: string;
  messageId: string | undefined;
}

interface Response {
  statusCode: number;
  message: string;
}

export class ToForwardService {
  public execute({ senderId, addresseeId, messageId }: Request): Response {
    const sender = users.find(user => user.id === senderId);
    const addressee = users.find(user => user.id === addresseeId);
    const messageToForward = messages.find(message => message.id === messageId);

    if (!sender) {
      return { statusCode: 400, message: 'Sender not found' };
    }

    if (!addressee) {
      return { statusCode: 400, message: 'Addressee not found' };
    }

    if (!messageToForward) {
      return { statusCode: 400, message: 'Message to forward not found' };
    }

    if (sender.id !== messageToForward.senderId && sender.id !== messageToForward.addresseeId) {
      return { statusCode: 400, message: 'Sender not in conversation' };
    }

    const newMessage = {
      ...messageToForward,
      senderId: sender.id,
      addresseeId: addressee.id,
      forwardingTo: messageToForward.id,
    } as IMessageDTO;

    messages.push(newMessage);

    return { statusCode: 201, message: JSON.stringify(newMessage) };
  }
}