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
}

export class ShowMessageService {
  private messagesRepository: IMessagesRepository;
  private userMessagesRepository: IUserMessagesRepository;
  constructor(messagesRepository: IMessagesRepository, userMessagesRepository: IUserMessagesRepository) {
    this.messagesRepository = messagesRepository;
    this.userMessagesRepository = userMessagesRepository;
  }

  public async execute(queryParams: Request): Promise<Response> {
    const { message_id, sender_id, addressee_id } = queryParams;
    if (!message_id) {
      const messages = await this.userMessagesRepository.all();
      return { statusCode: 200, message: JSON.stringify(messages) };
    }

    if (!sender_id && !addressee_id) {
      return { statusCode: 400, message: 'Missing params' };
    }

    const message = await this.messagesRepository.findById(message_id);

    if (!message) {
      return { statusCode: 404, message: 'Message not found' };
    }

    const userMessages = await this.userMessagesRepository.findEmail({ message_id, sender_id, addressee_id });

    if (!userMessages) {
      return { statusCode: 404, message: 'Message not found' };
    }

    return { statusCode: 200, message: JSON.stringify(userMessages) };
  }
}