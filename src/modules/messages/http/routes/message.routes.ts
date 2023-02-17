import { IncomingMessage, ServerResponse } from 'http';
import { MessageController } from '../controller/MessageController';

const messageController = new MessageController();

export function router(req: IncomingMessage, res: ServerResponse) {
  if (req.method === 'GET' && (req.url === '/messages' || req.url === '/messages/')) {
    messageController.get(req, res);
  } else if (req.method === 'POST' && (req.url === '/messages' || req.url === '/messages/')) {
    messageController.post(req, res);
  } else if (req.method === 'DELETE') {
    messageController.delete(req, res);
  } else {
    res.statusCode = 404;
    res.end();
  }
}