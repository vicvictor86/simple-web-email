import { IncomingMessage, ServerResponse } from 'http';

import { Message } from '@modules/messages/infra/typeorm/entities/Message';
import { CreateMessageService } from '@modules/messages/service/CreateMessageService';
import { DeleteMessageService } from '@modules/messages/service/DeleteMessageService';
import { ShowMessageService } from '@modules/messages/service/ShowMessageService';
import { IMessagesRepository } from '@modules/messages/repositories/IMessageRepositories';

import container from '@shared/container';
import { IUserMessagesRepository } from '@modules/messages/repositories/IUserMessagesRepository';
import { getParamsOfQueryParams } from '@shared/utils/getParamsOfQueryParams';
import { errorHandler } from '@shared/infra/http/middlewares/ErrorHandler';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { UpdateMessageService } from '@modules/messages/service/UpdateMessageService';

export class MessageController {
  async get(req: IncomingMessage, res: ServerResponse) {
    const messagesRepository = container.resolve<IMessagesRepository>('MessagesRepository');
    const userMessagesRepository = container.resolve<IUserMessagesRepository>('UserMessagesRepository');

    const showMessageService = new ShowMessageService(messagesRepository, userMessagesRepository);

    const stringQueryParams = req.url?.split('?')[1];
    const queryParams = getParamsOfQueryParams(stringQueryParams);

    const { statusCode, message } = await showMessageService.execute(queryParams);

    res.statusCode = statusCode;
    res.end(message);
  }

  async post(req: IncomingMessage, res: ServerResponse) {
    const messagesRepository = container.resolve<IMessagesRepository>('MessagesRepository');
    const userMessagesRepository = container.resolve<IUserMessagesRepository>('UserMessagesRepository');
    const usersRepository = container.resolve<IUsersRepository>('UsersRepository');

    const createMessageService = new CreateMessageService(messagesRepository, userMessagesRepository, usersRepository);

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
        const bodyData = JSON.parse(body);
        const keysNeededInMessage = Object.keys(new Message());

        const response = await createMessageService.execute({ bodyData, keysNeededInMessage });
        const { statusCode, message } = response;

        res.statusCode = statusCode;
        res.end(message);
      } catch (err: any) {
        errorHandler(err, req, res);
      }
    });
  }

  async put(req: IncomingMessage, res: ServerResponse) {
    const userMessagesRepository = container.resolve<IUserMessagesRepository>('UserMessagesRepository');

    const updateMessageService = new UpdateMessageService(userMessagesRepository);

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
        const bodyData = JSON.parse(body);

        const response = await updateMessageService.execute({ bodyData });
        const { statusCode, message } = response;

        res.statusCode = statusCode;
        res.end(message);
      } catch (err: any) {
        errorHandler(err, req, res);
      }
    });
  }

  async delete(req: IncomingMessage, res: ServerResponse) {
    const messagesRepository = container.resolve<IMessagesRepository>('MessagesRepository');
    const userMessagesRepository = container.resolve<IUserMessagesRepository>('UserMessagesRepository');

    const deleteMessageService = new DeleteMessageService(messagesRepository, userMessagesRepository);

    const userMessageId = req.url?.split('/')[2].split('?')[0];
    const queryParams = req.url?.split('?')[1];
    
    const userId = getParamsOfQueryParams(queryParams).user_id;

    const { statusCode, message } = await deleteMessageService.execute({ userMessageId, userId });

    res.statusCode = statusCode;
    res.end(message);
  }
};
