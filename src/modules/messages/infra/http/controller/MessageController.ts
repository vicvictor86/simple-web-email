import { IncomingMessage, ServerResponse } from 'http';

import { Message } from '@modules/messages/infra/typeorm/entities/Message';
import { CreateMessageService } from '@modules/messages/service/CreateMessageService';
import { DeleteMessageService } from '@modules/messages/service/DeleteMessageService';
import { ShowMessageService } from '@modules/messages/service/ShowMessageService';
import { IMessagesRepository } from '@modules/messages/repositories/IMessageRepositories';

import container from '@shared/container';
import { IUserMessagesRepository } from '@modules/messages/repositories/IUserMessagesRepository';
import { getParamsOfQueryParams } from '@shared/utils/getParamsOfQueryParams';

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

    const createMessageService = new CreateMessageService(messagesRepository, userMessagesRepository);

    let body = '';
    req.on('data', requestBody => {
      body += requestBody.toString();
    });

    req.on('end', async () => {
      const bodyData = JSON.parse(body);
      const keysNeededInMessage = Object.keys(new Message());

      const response = await createMessageService.execute({ bodyData, keysNeededInMessage });
      const { statusCode, message } = response;

      res.statusCode = statusCode;
      res.end(message);
    });
  }

  async delete(req: IncomingMessage, res: ServerResponse) {
    const messagesRepository = container.resolve<IMessagesRepository>('MessagesRepository');
    const userMessagesRepository = container.resolve<IUserMessagesRepository>('UserMessagesRepository');

    const deleteMessageService = new DeleteMessageService(messagesRepository, userMessagesRepository);

    const messageId = req.url?.split('/')[2];

    const { statusCode, message } = await deleteMessageService.execute(messageId);

    res.statusCode = statusCode;
    res.end(message);
  }
};
