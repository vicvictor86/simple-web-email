import { IMessagesRepository } from "../repositories/IMessageRepositories";

interface Response {
  statusCode: number;
  message?: string;
}

export class ShowMessageService {
  private messagesRepository: IMessagesRepository;
  constructor(messagesRepository: IMessagesRepository) {
    this.messagesRepository = messagesRepository;
  }

  public async execute(messageId: string | undefined): Promise<Response> {
    if (!messageId) {
      const messages = await this.messagesRepository.all();
      return { statusCode: 200, message: JSON.stringify(messages) };
    }

    const message = await this.messagesRepository.findById(messageId);

    if (!message) {
      return { statusCode: 404, message: 'Message not found' };
    }

    return { statusCode: 200, message: JSON.stringify(message) };
  }
}