import { users } from "../../../../server";
import { hasAllAttributes } from "../../../../utils/checkBodyData";
import { MessageDTO } from "../../dtos/MessagesDTO";

interface Response {
  statusCode: number;
  message: string;
}

export class CreateMessageService {
  public execute(newMessage: any, keysNeededInMessage: string[], messages: MessageDTO[]): Response {
    const newMessageWithReplyingTo = newMessage.replyingTo ? newMessage as MessageDTO : { ...newMessage, replyingTo: "" } as MessageDTO;
    if (!hasAllAttributes(newMessageWithReplyingTo, keysNeededInMessage)) {
      return { statusCode: 400, message: 'Missing attributes' };
    }

    const sender = users.find(user => user.name === newMessageWithReplyingTo.sender);
    const addressee = users.find(user => user.name === newMessageWithReplyingTo.addressee);
    const messageReplying = messages.find(message => message.id === newMessageWithReplyingTo.replyingTo);

    if (!sender) {
      return { statusCode: 400, message: 'Sender not found' };
    }

    if (!addressee) {
      return { statusCode: 400, message: 'Addressee not found' };
    }

    if (newMessageWithReplyingTo.replyingTo && !messageReplying) {
      return { statusCode: 400, message: 'Message replying to not found' };
    }
    
    if (messageReplying) {
      const senderInConversation = newMessageWithReplyingTo.sender === messageReplying.sender || newMessageWithReplyingTo.sender === messageReplying.addressee;

      if (!senderInConversation) {
        return { statusCode: 400, message: 'Sender not in conversation' };
      }
    }

    messages.push(newMessageWithReplyingTo);

    return { statusCode: 201, message: JSON.stringify(newMessageWithReplyingTo) };
  }
}