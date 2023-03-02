import { IncomingMessage, ServerResponse } from 'http';
import { UserController } from '../controller/UserController';

const userController = new UserController();

export async function router(req: IncomingMessage, res: ServerResponse) {
  if (req.method === 'GET') {
    await userController.get(req, res);
  } else if (req.method === 'POST') {
    await userController.post(req, res);
  } else {
    res.statusCode = 404;
    res.end();
  }
}