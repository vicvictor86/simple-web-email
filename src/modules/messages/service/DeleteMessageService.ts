import { IMessagesRepository } from "../repositories/IMessageRepositories";
import { IUserMessagesRepository } from "../repositories/IUserMessagesRepository";

interface Response {
  statusCode: number;
  message?: string;
}

export class DeleteMessageService {
  private messagesRepository: IMessagesRepository;
  private userMessagesRepository: IUserMessagesRepository;
  constructor(messagesRepository: IMessagesRepository, userMessagesRepository: IUserMessagesRepository) {
    this.messagesRepository = messagesRepository;
    this.userMessagesRepository = userMessagesRepository;
  }
  
  public async execute(userMessageId: string | undefined): Promise<Response> {
    if (!userMessageId) {
      return { statusCode: 400, message: 'Email id is required' };
    }

    const messageToDelete = await this.userMessagesRepository.findById(userMessageId);

    if(!messageToDelete) {
      return { statusCode: 404, message: 'Message not found' };
    }

    await this.userMessagesRepository.delete(userMessageId);

    const existUserMessageThatHasMessageId = await this.userMessagesRepository.findOneByMessageId(messageToDelete.message_id);

    if (!existUserMessageThatHasMessageId) {
      await this.messagesRepository.delete(messageToDelete.message_id);
    }

    return { statusCode: 200 };
  }
}