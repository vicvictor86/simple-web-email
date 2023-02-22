import { users } from "../../../../server";
import { hasAllAttributes } from "../../../../utils/checkBodyData";
import { IMessageDTO } from "../../dtos/IMessageDTO";

interface Request {
  bodyData: any;
  keysNeededInMessage: string[];
  messages: IMessageDTO[];
}

interface Response {
  statusCode: number;
  message: string;
}

export class CreateMessageService {
  public execute({ bodyData, keysNeededInMessage, messages }: Request): Response {
    const newMessageWithReplyingTo = bodyData.replyingTo ? bodyData as IMessageDTO : { ...bodyData, replyingTo: "" } as IMessageDTO;
    if (!hasAllAttributes(newMessageWithReplyingTo, keysNeededInMessage)) {
      return { statusCode: 400, message: 'Missing attributes' };
    }

    const sender = users.find(user => user.id === newMessageWithReplyingTo.senderId);
    const addressee = users.find(user => user.id === newMessageWithReplyingTo.addresseeId);
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
      const senderInConversation = newMessageWithReplyingTo.senderId === messageReplying.senderId || newMessageWithReplyingTo.senderId === messageReplying.addresseeId;

      if (!senderInConversation) {
        return { statusCode: 400, message: 'Sender not in conversation' };
      }
    }

    messages.push(newMessageWithReplyingTo);

    return { statusCode: 201, message: JSON.stringify(newMessageWithReplyingTo) };
  }
}