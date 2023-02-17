import { IncomingMessage, ServerResponse } from 'http';

import { UserDTO } from '../../dtos/UserDTO';
import { User } from '../../entities/User';
import { CreateUserService } from '../service/CreateUserService';

export class UserController {
  users: UserDTO[] = [];

  get(req: IncomingMessage, res: ServerResponse) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(this.users));
  }

  post(req: IncomingMessage, res: ServerResponse) {
    const createUserService = new CreateUserService();

    let body = '';
    req.on('data', requestBody => {
      body += requestBody.toString();
    });

    req.on('end', () => {
      const newUser = JSON.parse(body);
      const keysNeededInUser = Object.keys(new User());

      const { statusCode, message } = createUserService.execute(req, res, newUser, keysNeededInUser, this.users);

      res.statusCode = statusCode;
      res.end(message);
    });
  }
};
