import { AppError } from "@shared/error/AppError";
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
      throw new AppError('Email is required', 400);
    }

    const messageToDelete = await this.userMessagesRepository.findById(userMessageId);

    if(!messageToDelete) {
      throw new AppError('Message not found', 404);
    }

    await this.userMessagesRepository.delete(userMessageId);

    const existUserMessageThatHasMessageId = await this.userMessagesRepository.findOneByMessageId(messageToDelete.message_id);

    if (!existUserMessageThatHasMessageId) {
      await this.messagesRepository.delete(messageToDelete.message_id);
    }

    return { statusCode: 200 };
  }
}