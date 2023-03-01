import { IUserMessagesRepository } from "../repositories/IUserMessagesRepository";
import { hasAllAttributes } from "../../../shared/utils/checkBodyData";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { ICreateUserMessagesDTO } from "../dtos/ICreateUserMessagesDTO";

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
      return { statusCode: 400, message: 'Missing params' };
    }

    const { userMessageId, senderId, addresseeId } = bodyData;

    const userMessages = await this.userMessagesRepository.findById(userMessageId);

    if (!userMessages) {
      return { statusCode: 400, message: 'User message not found' };
    }

    const sender = await this.usersRepository.findById(senderId);

    if (!sender) {
      return { statusCode: 400, message: 'Sender not found' };
    }

    const addressee = await this.usersRepository.findById(addresseeId);

    if (!addressee) {
      return { statusCode: 400, message: 'Addressee not found' };
    }

    if (sender.id !== userMessages.sender_id && sender.id !== userMessages.addressee_id) {
      return { statusCode: 400, message: 'Sender not in conversation' };
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