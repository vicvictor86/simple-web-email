import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";

interface Response {
  statusCode: number;
  message: string;
}

export class ShowUsersService {
  private usersRepository: IUsersRepository;
  constructor(usersRepository: IUsersRepository) {
    this.usersRepository = usersRepository;
  }

  public async execute(userId:string | undefined): Promise<Response>{
    if(userId){
      const user = await this.usersRepository.findById(userId);
      return { statusCode: 200, message: JSON.stringify(user)};
    }
    const users = await this.usersRepository.all();

    return { statusCode: 201, message: JSON.stringify(users)};
  }
}