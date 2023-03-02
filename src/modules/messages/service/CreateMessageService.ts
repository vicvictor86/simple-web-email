import { AppError } from "@shared/error/AppError";
import { hasAllAttributes } from "../../../shared/utils/checkBodyData";
import { ICreateMessageDTO } from "../dtos/ICreateMessageDTO";
import { ICreateUserMessagesDTO } from "../dtos/ICreateUserMessagesDTO";
import { IMessagesRepository } from "../repositories/IMessageRepositories";
import { IUserMessagesRepository } from "../repositories/IUserMessagesRepository";

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
  private userMessagesRepository: IUserMessagesRepository;
  constructor(messagesRepository: IMessagesRepository, userMessagesRepository: IUserMessagesRepository) {
    this.messagesRepository = messagesRepository;
    this.userMessagesRepository = userMessagesRepository;
  }

  public async execute({ bodyData, keysNeededInMessage }: Request): Promise<Response> {
    const messageData = {
      text: bodyData.text,
      subject: bodyData.subject,
    } as ICreateMessageDTO;

    if (!hasAllAttributes(messageData, keysNeededInMessage)) {
      throw new AppError('Missing attributes', 400);
    }

    const verifyUserMessagesAttributes = ['sender', 'addressees'];
    const userMessagesDataToVerify = {
      sender: bodyData.sender,
      addressees: bodyData.addressees,
    }

    if (!hasAllAttributes(userMessagesDataToVerify, verifyUserMessagesAttributes)) {
      throw new AppError('Missing attributes', 400);
    }

    if (bodyData.replyingTo) {
      const messageReplying = await this.userMessagesRepository.findById(bodyData.replyingTo);

      if (!messageReplying) {
        throw new AppError('Message replying to not found', 400);
      }
    }

    const newMessage = await this.messagesRepository.create(messageData);

    const userMessagesData: ICreateUserMessagesDTO[] = bodyData.addressees.map((addresseeId: string) => {
      return {
        message_id: newMessage.id,
        sender_id: bodyData.sender,
        addressee_id: addresseeId,
        replying_to_id: bodyData.replyingTo,
        forwarding_to_id: bodyData.forwardingTo,
        read: false,
      } as ICreateUserMessagesDTO;
    });

    const newUserMessagesPromises = userMessagesData.map(async (userMessageData) => {
      return this.userMessagesRepository.create(userMessageData);
    });

    const newUserMessages = await Promise.all(newUserMessagesPromises);

    // if (newMessageWithReplyingTo.replyingTo && !messageReplying) {
    //   return { statusCode: 400, message: 'Message replying to not found' };
    // }

    // if (messageReplying) {
    //   const senderInConversation = newMessageWithReplyingTo.senderId === messageReplying.senderId || newMessageWithReplyingTo.senderId === messageReplying.addresseeId;

    //   if (!senderInConversation) {
    //     return { statusCode: 400, message: 'Sender not in conversation' };
    //   }
    // }

    return { statusCode: 201, message: JSON.stringify(newUserMessages) };
  }
}