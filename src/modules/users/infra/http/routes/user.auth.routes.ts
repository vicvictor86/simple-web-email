import { IncomingMessage, ServerResponse } from 'http';
import { UserAuthController } from '../controller/UserAuthController';

const userAuthController = new UserAuthController();

export async function router(req: IncomingMessage, res: ServerResponse) {
  if (req.method === 'POST') {
    await userAuthController.post(req, res);
  } else {
    res.statusCode = 404;
    res.end();
  }
}