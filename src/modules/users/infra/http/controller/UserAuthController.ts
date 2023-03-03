import { IncomingMessage, ServerResponse } from 'http';

import container from '@shared/container';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { AuthUserService } from '@modules/users/service/AuthUserService';
import { errorHandler } from '@shared/infra/http/middlewares/ErrorHandler';

export class UserAuthController {
  async post(req: IncomingMessage, res: ServerResponse) {
    const usersRepository = container.resolve<IUsersRepository>('UsersRepository');
    const authUserService = new AuthUserService(usersRepository);

    let body = '';
    req.on('data', requestBody => {
      try {
        body += requestBody.toString();
      } catch (err: any) {
        errorHandler(err, req, res);
      }
    });

    req.on('end', async () => {
      try {
        const user = JSON.parse(body);

        const { statusCode, message } = await authUserService.execute(user);

        res.statusCode = statusCode;
        res.end(message);
      } catch (err: any) {
        errorHandler(err, req, res);
      }
    });
  }
};
