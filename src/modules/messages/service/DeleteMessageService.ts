import { IMessagesRepository } from "../repositories/IMessageRepositories";

interface Response {
  statusCode: number;
  message?: string;
}

export class DeleteMessageService {
  private messagesRepository: IMessagesRepository;
  constructor(messagesRepository: IMessagesRepository) {
    this.messagesRepository = messagesRepository;
  }
  
  public async execute(messageId: string | undefined): Promise<Response> {
    if (!messageId) {
      return { statusCode: 400, message: 'Message id is required' };
    }

    const messageIndex = await this.messagesRepository.findById(messageId);

    if(!messageIndex) {
      return { statusCode: 404, message: 'Message not found' };
    }

    await this.messagesRepository.delete(messageId);

    return { statusCode: 200 };
  }
}