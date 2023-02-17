import { messages } from "../../../../server";

interface Response {
  statusCode: number;
  message?: string;
}

export class ShowMessageService {
  public execute(messageId: string | undefined): Response {
    if (!messageId) {
      return { statusCode: 200, message: JSON.stringify(messages)};
    }

    const message = messages.find(message => message.id === messageId);

    if(!message) {
      return { statusCode: 404, message: 'Message not found' };
    }

    return { statusCode: 200, message: JSON.stringify(message) };
  }
}