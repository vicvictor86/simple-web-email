import { IncomingMessage, ServerResponse } from 'http';

import { User } from '@modules/users/infra/typeorm/entities/User';
import { CreateUserService } from '@modules/users/service/CreateUserService';
import container from '@shared/container';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { ShowUsersService } from '@modules/users/service/ShowUsersServices';

export class UserController {
  async get(req: IncomingMessage, res: ServerResponse) {
    const usersRepository = container.resolve<IUsersRepository>('UsersRepository');

    const userId = req.url?.split('/')[2];

    const showUsersService = new ShowUsersService(usersRepository);
    const { statusCode, message } = await showUsersService.execute(userId);

    res.statusCode = statusCode;
    res.end(message);
  }

  async post(req: IncomingMessage, res: ServerResponse) {
    const usersRepository = container.resolve<IUsersRepository>('UsersRepository');
    const createUserService = new CreateUserService(usersRepository);

    let body = '';
    req.on('data', requestBody => {
      body += requestBody.toString();
    });

    req.on('end', async () => {
      const newUser = JSON.parse(body);
      const keysNeededInUser = Object.keys(new User());

      const { statusCode, message } = await createUserService.execute(newUser, keysNeededInUser);

      res.statusCode = statusCode;
      res.end(message);
    });
  }
};
