import { IncomingMessage, ServerResponse } from 'http';
import { messages } from '../../../../server';

import { Message } from '../../entities/Message';
import { CreateMessageService } from '../service/CreateMessageService';
import { DeleteMessageService } from '../service/DeleteMessageService';
import { ShowMessageService } from '../service/ShowMessageService';

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

    let body = '';
    req.on('data', requestBody => {
      body += requestBody.toString();
    });

    req.on('end', () => {
      const newMessage = JSON.parse(body);
      const keysNeededInMessage = Object.keys(new Message());

      const { statusCode, message } = createMessageService.execute(newMessage, keysNeededInMessage, messages);

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
