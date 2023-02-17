import { messages } from "../../../../server";

interface Response {
  statusCode: number;
  message?: string;
}

export class DeleteMessageService {
  public execute(messageId: string | undefined): Response {
    if (!messageId) {
      return { statusCode: 400, message: 'Message id is required' };
    }

    const messageIndex = messages.findIndex(message => message.id === messageId);

    if(messageIndex === -1) {
      return { statusCode: 404, message: 'Message not found' };
    }

    messages.splice(messageIndex, 1);

    return { statusCode: 200 };
  }
}