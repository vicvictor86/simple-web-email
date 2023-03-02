import { AppError } from "@shared/error/AppError";
import { IMessagesRepository } from "../repositories/IMessageRepositories";
import { IUserMessagesRepository } from "../repositories/IUserMessagesRepository";

interface Response {
  statusCode: number;
  message?: string;
}

interface Request {
  message_id: string;
  sender_id: string;
  addressee_id: string;
  user_messages_id: string;
}

export class ShowMessageService {
  private messagesRepository: IMessagesRepository;
  private userMessagesRepository: IUserMessagesRepository;
  constructor(messagesRepository: IMessagesRepository, userMessagesRepository: IUserMessagesRepository) {
    this.messagesRepository = messagesRepository;
    this.userMessagesRepository = userMessagesRepository;
  }

  public async execute(queryParams: Request): Promise<Response> {
    const { message_id, sender_id, addressee_id, user_messages_id } = queryParams;

    if (user_messages_id) {
      const userMessages = await this.userMessagesRepository.findById(user_messages_id);

      if (!userMessages) {
        throw new AppError('Message not found', 404);
      }

      return { statusCode: 200, message: JSON.stringify(userMessages) };
    }

    if (!message_id && !sender_id && !addressee_id) {
      const messages = await this.userMessagesRepository.all();
      return { statusCode: 200, message: JSON.stringify(messages) };
    }

    if (!sender_id || !addressee_id || !message_id) {
      throw new AppError('Missing parameters');
    }

    const message = await this.messagesRepository.findById(message_id);

    if (!message) {
      throw new AppError('Message not found', 404);
    }

    const userMessages = await this.userMessagesRepository.findEmail({ message_id, sender_id, addressee_id });

    if (!userMessages) {
      throw new AppError('Message not found', 404);
    }

    return { statusCode: 200, message: JSON.stringify(userMessages) };
  }
}