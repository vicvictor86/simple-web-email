import { IncomingMessage, ServerResponse } from 'http';
import { ForwardController } from '../controller/ForwardController';
import { MessageController } from '../controller/MessageController';

const messageController = new MessageController();
const forwardController = new ForwardController();

export async function router(req: IncomingMessage, res: ServerResponse) {
  if (req.method === 'POST' && (req.url === '/messages/forward'|| req.url === '/messages/forward/')) {
    await forwardController.post(req, res);
  } else if (req.method === 'GET') {
    await messageController.get(req, res);
  } else if (req.method === 'POST') {
    await messageController.post(req, res);
  } else if (req.method === 'PUT') {
    await messageController.put(req, res);
  } else if (req.method === 'DELETE') {
    await messageController.delete(req, res);
  } else {
    res.statusCode = 404;
    res.end();
  }
}