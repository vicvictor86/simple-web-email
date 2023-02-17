import { IncomingMessage, ServerResponse } from 'http';
import { users } from '../../../../server';

import { User } from '../../entities/User';
import { CreateUserService } from '../service/CreateUserService';

export class UserController {
  get(req: IncomingMessage, res: ServerResponse) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(users));
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

      const { statusCode, message } = createUserService.execute(req, res, newUser, keysNeededInUser, users);

      res.statusCode = statusCode;
      res.end(message);
    });
  }
};
