import { IncomingMessage, ServerResponse } from "http";
import { router as UseRouter } from "../../modules/users/http/routes/user.routes";
import { router as MessageRouter } from "../../modules/messages/http/routes/message.routes";

export function router(req: IncomingMessage, res: ServerResponse) {
  if (req.url === undefined) {
    res.statusCode = 404;
    res.end();
    return;
  }
  
  if (req.url.includes('users')) {
    UseRouter(req, res);
    return;
  } else if (req.url.includes('messages')) {
    MessageRouter(req, res);
    return;
  } else {
    res.statusCode = 404;
    res.end();
  }
}