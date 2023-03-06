import { AppError } from "@shared/error/AppError";
import { hasAllAttributes } from "../../../shared/utils/checkBodyData";
import { IUpdateUserMessagesDTO } from "../dtos/IUpdateUserMessagesDTO";
import { IUserMessagesRepository } from "../repositories/IUserMessagesRepository";

interface Request {
  bodyData: any;
}

interface Response {
  statusCode: number;
  message: string;
}

export class UpdateMessageService {
  private userMessagesRepository: IUserMessagesRepository;
  constructor(userMessagesRepository: IUserMessagesRepository) {
    this.userMessagesRepository = userMessagesRepository;
  }

  public async execute({ bodyData }: Request): Promise<Response> {
    const verifyUserMessagesAttributes = ['id'];
    const userMessagesDataToVerify = {
      id: bodyData.id,
    }

    if (!hasAllAttributes(userMessagesDataToVerify, verifyUserMessagesAttributes)) {
      throw new AppError('Missing attributes', 400);
    }

    const updateInfo = {
      id: bodyData.id,
      read: bodyData.read,
    } as IUpdateUserMessagesDTO;

    const messageToUpdate = await this.userMessagesRepository.findById(updateInfo.id)

    if (!messageToUpdate) {
      throw new AppError('Message not found', 404);
    }

    if (typeof messageToUpdate.read !== "boolean") {
      throw new AppError('Read must be boolean', 400);
    }

    const messageUpdated = await this.userMessagesRepository.update(updateInfo);

    return { statusCode: 201, message: JSON.stringify(messageUpdated) };
  }
}