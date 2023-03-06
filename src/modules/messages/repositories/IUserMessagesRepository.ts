import { UserMessages } from '../infra/typeorm/entities/UserMessages';

import { ICreateUserMessagesDTO } from '../dtos/ICreateUserMessagesDTO';
import { IFindEmail } from '../dtos/IFindEmailDTO';
import { IUpdateUserMessagesDTO } from '../dtos/IUpdateUserMessagesDTO';
import { ISoftDeleteUserMessagesDTO } from '../dtos/ISoftDeleteMessageDTO';

export interface IUserMessagesRepository {
  create(data: ICreateUserMessagesDTO): Promise<UserMessages>;
  update(data: IUpdateUserMessagesDTO): Promise<UserMessages>;
  delete(id: string): Promise<void>;
  softDelete(deleteInfo: ISoftDeleteUserMessagesDTO): Promise<void>;
  findById(id: string): Promise<UserMessages | undefined>;
  findByMessageId(id: string): Promise<UserMessages[] | undefined>;
  findOneByMessageId(id: string): Promise<UserMessages | undefined>;
  findByUserId(user_id: string): Promise<UserMessages[] | undefined>;
  findEmail(findEmail: IFindEmail): Promise<UserMessages[] | undefined>;
  all(): Promise<UserMessages[] | undefined>;
}