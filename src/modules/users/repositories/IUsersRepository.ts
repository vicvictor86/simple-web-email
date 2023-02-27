import { User } from '../infra/typeorm/entities/User';

import { ICreateUserDTO } from '../dtos/ICreateUserDTO';

export interface IUsersRepository {
  create(data: ICreateUserDTO): Promise<User>;
  findById(id: string): Promise<User | undefined>;
  findByName(name: string): Promise<User | undefined>;
  all(): Promise<User[] | undefined>;
}