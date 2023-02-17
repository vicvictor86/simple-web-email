import { users } from "../../../../server";
import { hasAllAttributes } from "../../../../utils/checkBodyData";
import { MessageDTO } from "../../dtos/MessagesDTO";

interface Response {
  statusCode: number;
  message: string;
}

export class CreateMessageService {
  public execute(newMessage: any, keysNeededInMessage: string[], messages: MessageDTO[]): Response {
    if (!hasAllAttributes(newMessage, keysNeededInMessage)) {
      return { statusCode: 400, message: 'Missing attributes' };
    }

    const typedNewMessage = newMessage as MessageDTO;

    const sender = users.find(user => user.name === typedNewMessage.sender);
    const addressee = users.find(user => user.name === typedNewMessage.addressee);

    if (!sender) {
      return { statusCode: 400, message: 'Sender not found' };
    }

    if (!addressee) {
      return { statusCode: 400, message: 'Addressee not found' };
    }

    messages.push(typedNewMessage);

    return { statusCode: 201, message: JSON.stringify(typedNewMessage) };
  }
}