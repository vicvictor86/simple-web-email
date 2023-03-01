import { IncomingMessage, ServerResponse } from 'http';
import { ForwardController } from '../controller/ForwardController';
import { MessageController } from '../controller/MessageController';

const messageController = new MessageController();
const forwardController = new ForwardController();

export function router(req: IncomingMessage, res: ServerResponse) {
  if (req.method === 'POST' && (req.url === '/messages/forward'|| req.url === '/messages/forward/')) {
    forwardController.post(req, res);
  } else if (req.method === 'GET') {
    messageController.get(req, res);
  } else if (req.method === 'POST') {
    messageController.post(req, res);
  } else if (req.method === 'DELETE') {
    messageController.delete(req, res);
  } else {
    res.statusCode = 404;
    res.end();
  }
}