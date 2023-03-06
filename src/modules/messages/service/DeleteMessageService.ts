import { AppError } from "@shared/error/AppError";
import { IMessagesRepository } from "../repositories/IMessageRepositories";
import { IUserMessagesRepository } from "../repositories/IUserMessagesRepository";

interface Request {
  userMessageId: string | undefined;
  userId: string | undefined;
}

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

  public async execute({ userId, userMessageId }: Request): Promise<Response> {
    if (!userMessageId) {
      throw new AppError('Id message is required', 400);
    }

    const messageToDelete = await this.userMessagesRepository.findById(userMessageId);

    if (!messageToDelete) {
      throw new AppError('Message not found', 404);
    }


    const isSender = messageToDelete.sender_id === userId;

    if (isSender) {
      await this.userMessagesRepository.softDelete({ id: messageToDelete.id, sender_delete: true });
    } else {
      await this.userMessagesRepository.softDelete({ id: messageToDelete.id, addressee_delete: true });
    }

    const updatedMessageToDelete = await this.userMessagesRepository.findById(userMessageId);

    if (updatedMessageToDelete?.sender_delete && updatedMessageToDelete.addressee_delete) {
      await this.userMessagesRepository.delete(userMessageId);
    } 

    const existUserMessageThatHasMessageId = await this.userMessagesRepository.findOneByMessageId(messageToDelete.message_id);

    if (!existUserMessageThatHasMessageId) {
      await this.messagesRepository.delete(messageToDelete.message_id);
    }

    return { statusCode: 200 };
  }
}