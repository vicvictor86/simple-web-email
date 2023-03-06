import { getRepository, Repository, Table } from 'typeorm';

import { IUserMessagesRepository } from '@modules/messages/repositories/IUserMessagesRepository';
import { ICreateUserMessagesDTO } from '@modules/messages/dtos/ICreateUserMessagesDTO';
import { UserMessages } from '../entities/UserMessages';
import { IFindEmail } from '@modules/messages/dtos/IFindEmailDTO';
import { IUpdateUserMessagesDTO } from '@modules/messages/dtos/IUpdateUserMessagesDTO';
import { ISoftDeleteUserMessagesDTO } from '@modules/messages/dtos/ISoftDeleteMessageDTO';

export class UserMessagesRepository implements IUserMessagesRepository {
  private ormRepository: Repository<UserMessages>;

  constructor() {
    this.ormRepository = getRepository(UserMessages);
  }

  public async create(newMessage: ICreateUserMessagesDTO): Promise<UserMessages> {
    const userMessages = this.ormRepository.create(newMessage);

    await this.ormRepository.save(userMessages);

    return userMessages;
  }

  public async update(newData: IUpdateUserMessagesDTO): Promise<UserMessages> {
    const messageToUpdate = await this.ormRepository.findOne({
      where: {
        id: newData.id,
      }
    });

    const updatedUserMessages = {
      ...messageToUpdate,
      ...(newData.read && { read: newData.read }),
    } as UserMessages;

    await this.ormRepository.save(updatedUserMessages)

    return updatedUserMessages;
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async softDelete(deleteInfo: ISoftDeleteUserMessagesDTO): Promise<void> {
    const messageToUpdate = await this.ormRepository.findOne({
      where: {
        id: deleteInfo.id,
      }
    });

    const updatedUserMessages = {
      ...messageToUpdate,
      ...(deleteInfo.addressee_delete && { addressee_delete: deleteInfo.addressee_delete }),
      ...(deleteInfo.sender_delete && { sender_delete: deleteInfo.sender_delete }),
    } as UserMessages;

    await this.ormRepository.save(updatedUserMessages)
  }

  public async findById(id: string): Promise<UserMessages | undefined> {
    const userMessages = await this.ormRepository.findOne(id);

    return userMessages;
  }

  public async findOneByMessageId(id: string): Promise<UserMessages | undefined> {
    const userMessages = await this.ormRepository.findOne({
      where: { message_id: id },
    });

    return userMessages;
  }

  public async findByMessageId(id: string): Promise<UserMessages[] | undefined> {
    const userMessages = await this.ormRepository.find({
      where: { message_id: id },
    });

    return userMessages;
  }

  public async findByUserId(user_id: string): Promise<UserMessages[] | undefined> {
    const userMessages = await this.ormRepository.find({
      where: [
        {
          sender_id: user_id,
        },
        {
          addressee_id: user_id
        }
      ],
    });

    return userMessages;
  }

  public async findEmail(findEmail: IFindEmail): Promise<UserMessages[] | undefined> {
    const { message_id, sender_id, addressee_id } = findEmail;
    const userMessages = await this.ormRepository.find({
      where: [
        {
          message_id,
          sender_id,
          addressee_id,
        },
      ],
    });

    return userMessages;
  }

  public async all(): Promise<UserMessages[] | undefined> {
    const userMessages = await this.ormRepository.find();

    return userMessages;
  }
}