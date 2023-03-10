import { IncomingMessage, ServerResponse } from 'http';
import { UserAuthController } from '../controller/UserAuthController';
import { UserController } from '../controller/UserController';

const userController = new UserController();
const userAuthController = new UserAuthController();

export async function router(req: IncomingMessage, res: ServerResponse) {
  if (req.method === 'POST' && (req.url === '/users/login'|| req.url === '/users/login/')) {
    await userAuthController.post(req, res);
  } else if (req.method === 'GET') {
    await userController.get(req, res);
  } else if (req.method === 'POST') {
    await userController.post(req, res);
  } else {
    res.statusCode = 404;
    res.end();
  }
}