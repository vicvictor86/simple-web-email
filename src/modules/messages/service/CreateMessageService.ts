import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { hasAllAttributes } from "../../../utils/checkBodyData";
import { ICreateMessageDTO } from "../dtos/ICreateMessageDTO";
import { IMessagesRepository } from "../repositories/IMessageRepositories";

interface Request {
  bodyData: any;
  keysNeededInMessage: string[];
}

interface Response {
  statusCode: number;
  message: string;
}

export class CreateMessageService {
  private messagesRepository: IMessagesRepository;
  constructor(messagesRepository: IMessagesRepository) {
    this.messagesRepository = messagesRepository;
  }

  public async execute({ bodyData, keysNeededInMessage }: Request): Promise<Response> {
    const newMessageWithReplyingTo = bodyData.replyingTo ? bodyData as ICreateMessageDTO : { ...bodyData, replyingTo: "", forwardingTo: "" } as ICreateMessageDTO;
    if (!hasAllAttributes(newMessageWithReplyingTo, keysNeededInMessage)) {
      return { statusCode: 400, message: 'Missing attributes' };
    }

    const messageReplying = this.messagesRepository.findById(newMessageWithReplyingTo.replyingTo);

    if (newMessageWithReplyingTo.replyingTo && !messageReplying) {
      return { statusCode: 400, message: 'Message replying to not found' };
    }

    // if (messageReplying) {
    //   const senderInConversation = newMessageWithReplyingTo.senderId === messageReplying.senderId || newMessageWithReplyingTo.senderId === messageReplying.addresseeId;

    //   if (!senderInConversation) {
    //     return { statusCode: 400, message: 'Sender not in conversation' };
    //   }
    // }

    const newMessage = await this.messagesRepository.create(newMessageWithReplyingTo);

    return { statusCode: 201, message: JSON.stringify(newMessage) };
  }
}