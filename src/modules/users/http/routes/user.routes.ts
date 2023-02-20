import { IncomingMessage, ServerResponse } from 'http';
import { UserController } from '../controller/UserController';

const userController = new UserController();

export function router(req: IncomingMessage, res: ServerResponse) {
  if (req.method === 'GET') {
    userController.get(req, res);
  } else if (req.method === 'POST') {
    userController.post(req, res);
  } else {
    res.statusCode = 404;
    res.end();
  }
}