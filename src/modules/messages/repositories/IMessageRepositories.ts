import { Message } from '../infra/typeorm/entities/Message';

import { ICreateMessageDTO } from '../dtos/ICreateMessageDTO';

export interface IMessagesRepository {
  create(data: ICreateMessageDTO): Promise<Message>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Message | undefined>;
  findBySubject(subject: string): Promise<Message | undefined>;
  all(): Promise<Message[] | undefined>;
}