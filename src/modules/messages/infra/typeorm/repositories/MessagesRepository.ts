import { getRepository, Repository } from 'typeorm';

import { IMessagesRepository } from '@modules/messages/repositories/IMessageRepositories';
import { ICreateMessageDTO } from '@modules/messages/dtos/ICreateMessageDTO';
import { Message } from '../entities/Message';

export class MessagesRepository implements IMessagesRepository {
  private ormRepository: Repository<Message>;

  constructor() {
    this.ormRepository = getRepository(Message);
  }
  
  public async create(newMessage: ICreateMessageDTO): Promise<Message> {
    const message = this.ormRepository.create(newMessage);

    await this.ormRepository.save(message);

    return message;
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async findById(id: string): Promise<Message | undefined> {
    const message = await this.ormRepository.findOne(id);

    return message;
  }

  public async findBySubject(subject: string): Promise<Message | undefined> {
    const message = await this.ormRepository.findOne({
      where: { subject },
    });

    return message;
  }

  public async all(): Promise<Message[] | undefined> {
    const messages = await this.ormRepository.find();

    return messages;
  }
}