import { IncomingMessage, ServerResponse } from 'http';

import { Message } from '@modules/messages/infra/typeorm/entities/Message';
import { CreateMessageService } from '@modules/messages/service/CreateMessageService';
import { DeleteMessageService } from '@modules/messages/service/DeleteMessageService';
import { ShowMessageService } from '@modules/messages/service/ShowMessageService';
import { ToForwardService } from '@modules/messages/service/ToForwardService';
import { IMessagesRepository } from '@modules/messages/repositories/IMessageRepositories';

import container from '@shared/container';

export class MessageController {
  async get(req: IncomingMessage, res: ServerResponse) {
    const messagesRepository = container.resolve<IMessagesRepository>('MessagesRepository');

    const showMessageService = new ShowMessageService(messagesRepository);

    const messageId = req.url?.split('/')[2];

    const { statusCode, message } = await showMessageService.execute(messageId);

    res.statusCode = statusCode;
    res.end(message);
  }

  post(req: IncomingMessage, res: ServerResponse) {
    const messagesRepository = container.resolve<IMessagesRepository>('MessagesRepository');

    const createMessageService = new CreateMessageService(messagesRepository);
    const toForwardService = new ToForwardService();

    let body = '';
    req.on('data', requestBody => {
      body += requestBody.toString();
    });

    const messageId = req.url?.split('/')[2];

    req.on('end', async () => {
      const bodyData = JSON.parse(body);
      const keysNeededInMessage = Object.keys(new Message());

      let statusCode: number;
      let message: string;

      if (messageId) {
        const { senderId, addresseeId } = bodyData;
        const response = toForwardService.execute({ senderId, addresseeId, messageId });

        statusCode = response.statusCode;
        message = response.message;
      } else {
        const response = await createMessageService.execute({ bodyData, keysNeededInMessage });
        statusCode = response.statusCode;
        message = response.message;
      }

      res.statusCode = statusCode;
      res.end(message);
    });
  }

  async delete(req: IncomingMessage, res: ServerResponse) {
    const messagesRepository = container.resolve<IMessagesRepository>('MessagesRepository');

    const deleteMessageService = new DeleteMessageService(messagesRepository);

    const messageId = req.url?.split('/')[2];

    const { statusCode, message } = await deleteMessageService.execute(messageId);

    res.statusCode = statusCode;
    res.end(message);
  }
};
