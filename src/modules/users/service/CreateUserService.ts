import { User } from "@modules/users/infra/typeorm/entities/User";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { AppError } from "@shared/error/AppError";
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
      throw new AppError('Missing params', 400);
    }

    const typedNewUser = newUser as User;

    const userAlreadyExists = await this.usersRepository.findByName(typedNewUser.name);

    if (userAlreadyExists) {
      throw new AppError('User already exists', 400);
    }

    const user = await this.usersRepository.create(typedNewUser);

    return { statusCode: 201, message: JSON.stringify(user)};
  }
}