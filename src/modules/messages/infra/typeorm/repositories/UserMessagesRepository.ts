import { getRepository, Repository, Table } from 'typeorm';

import { IUserMessagesRepository } from '@modules/messages/repositories/IUserMessagesRepository';
import { ICreateUserMessagesDTO } from '@modules/messages/dtos/ICreateUserMessagesDTO';
import { UserMessages } from '../entities/UserMessages';
import { IFindEmail } from '@modules/messages/dtos/IFindEmailDTO';

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


  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async findById(id: string): Promise<UserMessages | undefined> {
    const userMessages = await this.ormRepository.findOne(id);

    return userMessages;
  }

  public async findByUserId(user_id: string): Promise<UserMessages[] | undefined> {
    const userMessages = await this.ormRepository.find({
      where:[
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
      where:[
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