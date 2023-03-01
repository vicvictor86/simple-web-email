import { UserMessages } from '../infra/typeorm/entities/UserMessages';

import { ICreateUserMessagesDTO } from '../dtos/ICreateUserMessagesDTO';
import { IFindEmail } from '../dtos/IFindEmailDTO';

export interface IUserMessagesRepository {
  create(data: ICreateUserMessagesDTO): Promise<UserMessages>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<UserMessages | undefined>;
  findByUserId(user_id: string): Promise<UserMessages[] | undefined>;
  findEmail(findEmail: IFindEmail): Promise<UserMessages[] | undefined>;
  all(): Promise<UserMessages[] | undefined>;
}