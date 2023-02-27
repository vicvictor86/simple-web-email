import { getRepository, Repository } from 'typeorm';

import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { ICreateUserDTO } from '@modules/users/dtos/ICreateUserDTO';
import { User } from '../entities/User';

export class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async create({ name }: ICreateUserDTO): Promise<User> {
    const user = this.ormRepository.create({
      name,
    });

    await this.ormRepository.save(user);

    return user;
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne(id);

    return user;
  }

  public async findByName(name: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({
      where: { name },
    });

    return user;
  }

  public async all(): Promise<User[] | undefined> {
    const users = await this.ormRepository.find();

    return users;
  }
}