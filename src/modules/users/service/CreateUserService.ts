import { User } from "@modules/users/infra/typeorm/entities/User";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { IncomingMessage, ServerResponse } from "http";
import { hasAllAttributes } from "../../../shared/utils/checkBodyData";

interface Response {
  statusCode: number;
  message: string;
}

export class CreateUserService {
  private usersRepository: IUsersRepository;
  constructor(usersRepository: IUsersRepository) {
    this.usersRepository = usersRepository;
  }

  public async execute(newUser: any, keysNeededInUser: string[]): Promise<Response>{
    if (!hasAllAttributes(newUser, keysNeededInUser)) {
      return { statusCode: 400, message: 'Missing attributes' };
    }

    const typedNewUser = newUser as User;

    const userAlreadyExists = await this.usersRepository.findByName(typedNewUser.name);

    if (userAlreadyExists) {
      return { statusCode: 400, message: 'User already exists' };
    }

    const user = await this.usersRepository.create(typedNewUser);

    return { statusCode: 201, message: JSON.stringify(user)};
  }
}