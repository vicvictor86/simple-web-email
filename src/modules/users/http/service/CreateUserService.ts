import { IncomingMessage, ServerResponse } from "http";
import { hasAllAttributes } from "../../../../utils/checkBodyData";
import { UserDTO } from "../../dtos/UserDTO";

interface Response {
  statusCode: number;
  message: string;
}

export class CreateUserService {
  public execute(req: IncomingMessage, res: ServerResponse, newUser: any, keysNeededInUser: string[], users: UserDTO[]): Response{
    if (!hasAllAttributes(newUser, keysNeededInUser)) {
      return { statusCode: 400, message: 'Missing attributes' };
    }

    const typedNewUser = newUser as UserDTO;

    const userAlreadyExists = users.find(user => user.name === typedNewUser.name);

    if (userAlreadyExists) {
      return { statusCode: 400, message: 'User already exists' };
    }

    users.push(typedNewUser);

    return { statusCode: 201, message: JSON.stringify(typedNewUser)};
  }
}