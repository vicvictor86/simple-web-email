import { IUserMessagesRepository } from "../repositories/IUserMessagesRepository";
import { hasAllAttributes } from "../../../shared/utils/checkBodyData";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { ICreateUserMessagesDTO } from "../dtos/ICreateUserMessagesDTO";
import { AppError } from "@shared/error/AppError";

interface Request {
  userMessageId: string;
  senderId: string;
  addresseeId: string;
}

interface Response {
  statusCode: number;
  message: string;
}

export class ToForwardService {
  private usersRepository: IUsersRepository;
  private userMessagesRepository: IUserMessagesRepository;

  constructor(usersRepository: IUsersRepository, userMessagesRepository: IUserMessagesRepository) {
    this.usersRepository = usersRepository;
    this.userMessagesRepository = userMessagesRepository;
  }

  public async execute(bodyData: Request): Promise<Response> {
    const checkParams = ['userMessageId', 'senderId', 'addresseeId'];

    if (!hasAllAttributes(bodyData, checkParams)) {
      throw new AppError('Missing params');
    }

    const { userMessageId, senderId, addresseeId } = bodyData;

    const userMessages = await this.userMessagesRepository.findById(userMessageId);

    if (!userMessages) {
      throw new AppError('Message not found', 404);
    }

    const sender = await this.usersRepository.findById(senderId);

    if (!sender) {
      throw new AppError('Sender not found', 404);
    }

    const addressee = await this.usersRepository.findById(addresseeId);

    if (!addressee) {
      throw new AppError('Addressee not found', 404);
    }

    if (sender.id !== userMessages.sender_id && sender.id !== userMessages.addressee_id) {
      throw new AppError('You are not the sender or addressee of this message', 403);
    }

    const newMessage = {
      message_id: userMessages.message_id,
      sender_id: senderId,
      addressee_id: addresseeId,
      forwarding_to_id: userMessageId,
      replying_to_id: userMessages.replying_to_id,
      read: false,
    } as ICreateUserMessagesDTO;

    const newMessageDB = await this.userMessagesRepository.create(newMessage);

    return { statusCode: 201, message: JSON.stringify(newMessageDB) };
  }
}