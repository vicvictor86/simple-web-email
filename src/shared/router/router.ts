import { IncomingMessage, ServerResponse } from "http";
import { router as UseRouter } from "../../modules/users/http/routes/user.routes";
import { router as MessageRouter } from "../../modules/messages/http/routes/message.routes";

export function router(req: IncomingMessage, res: ServerResponse) {
  if (req.url === undefined) {
    res.statusCode = 404;
    res.end();
    return;
  }

  const regexUsers = /^\/users\/*\w*/;
  const regexMessages = /^\/messages\/*\w*/;
  
  if (regexUsers.test(req.url)) {
    UseRouter(req, res);
    return;
  } else if (regexMessages.test(req.url)) {
    MessageRouter(req, res);
    return;
  } else {
    res.statusCode = 404;
    res.end();
  }
}