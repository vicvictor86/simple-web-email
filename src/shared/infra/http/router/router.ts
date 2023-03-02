import { IncomingMessage, ServerResponse } from "http";
import { router as UserRouter } from "@modules/users/infra/http/routes/user.routes";
import { router as MessageRouter } from "@modules/messages/infra/http/routes/message.routes";

export async function router(req: IncomingMessage, res: ServerResponse) {
  if (req.url === undefined) {
    res.statusCode = 404;
    res.end();
    return;
  }

  //Match urls that start with /users/ and have or not something after it
  const regexUsers = /^\/users\/*\w*/;
  //Match urls that start with /messages/ and have or not something after it
  const regexMessages = /^\/messages\/*\w*/;

  if (regexUsers.test(req.url)) {
    await UserRouter(req, res);
  } else if (regexMessages.test(req.url)) {
    await MessageRouter(req, res);
  } else {
    res.statusCode = 404;
    res.end();
  }
}