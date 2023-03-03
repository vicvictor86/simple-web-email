import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { AppError } from "@shared/error/AppError";
import { hasAllAttributes } from "../../../shared/utils/checkBodyData";

interface Response {
  statusCode: number;
  message: string;
}

export class AuthUserService {
  private usersRepository: IUsersRepository;
  constructor(usersRepository: IUsersRepository) {
    this.usersRepository = usersRepository;
  }

  public async execute(userToAuth: any): Promise<Response>{
    const keysNeededInUser = ['name'];
    if (!hasAllAttributes(userToAuth, keysNeededInUser)) {
      throw new AppError('Missing params', 400);
    }

    const user = await this.usersRepository.findByName(userToAuth.name);

    if (!user) {
      throw new AppError('User not found', 400);
    }

    return { statusCode: 201, message: JSON.stringify(user)};
  }
}