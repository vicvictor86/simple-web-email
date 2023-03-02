import { IncomingMessage, ServerResponse } from 'http';

import { ToForwardService } from '@modules/messages/service/ToForwardService';
import { IUserMessagesRepository } from '@modules/messages/repositories/IUserMessagesRepository';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';

import container from '@shared/container';

export class ForwardController {
  async post(req: IncomingMessage, res: ServerResponse) {
    const userMessagesRepository = container.resolve<IUserMessagesRepository>('UserMessagesRepository');
    const userRepository = container.resolve<IUsersRepository>('UsersRepository');

    const toForwardService = new ToForwardService(userRepository, userMessagesRepository);

    let body = '';
    req.on('data', requestBody => {
      body += requestBody.toString();
    });

    req.on('end', async () => {
      const bodyData = JSON.parse(body);

      const { userMessageId, senderId, addresseeId } = bodyData;
      const response = await toForwardService.execute({ userMessageId, senderId, addresseeId });

      const { statusCode, message } = response;

      res.statusCode = statusCode;
      res.end(message);
    });
  }
};
