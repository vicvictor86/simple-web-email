import { IncomingMessage, ServerResponse } from 'http';
import { messages } from '../../../../server';

import { Message } from '../../infra/typeorm/entities/Message';
import { CreateMessageService } from '../service/CreateMessageService';
import { DeleteMessageService } from '../service/DeleteMessageService';
import { ShowMessageService } from '../service/ShowMessageService';
import { ToForwardService } from '../service/ToForwardService';

export class MessageController {
  get(req: IncomingMessage, res: ServerResponse) {
    const showMessageService = new ShowMessageService();

    const messageId = req.url?.split('/')[2];

    const { statusCode, message } = showMessageService.execute(messageId);

    res.statusCode = statusCode;
    res.end(message);
  }

  post(req: IncomingMessage, res: ServerResponse) {
    const createMessageService = new CreateMessageService();
    const toForwardService = new ToForwardService();

    let body = '';
    req.on('data', requestBody => {
      body += requestBody.toString();
    });

    const messageId = req.url?.split('/')[2];

    req.on('end', () => {
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
        const response = createMessageService.execute({ bodyData, keysNeededInMessage, messages });
        statusCode = response.statusCode;
        message = response.message;
      }


      res.statusCode = statusCode;
      res.end(message);
    });
  }

  delete(req: IncomingMessage, res: ServerResponse) {
    const deleteMessageService = new DeleteMessageService();

    const messageId = req.url?.split('/')[2];

    const { statusCode, message } = deleteMessageService.execute(messageId);

    res.statusCode = statusCode;
    res.end(message);
  }
};
