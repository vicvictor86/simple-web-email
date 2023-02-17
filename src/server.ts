import http from 'http';
import { MessageDTO } from './modules/messages/dtos/MessagesDTO';
import { UserDTO } from './modules/users/dtos/UserDTO';
import { router } from './shared/router/router';

export const messages: MessageDTO[] = [];
export const users: UserDTO[] = [];

const server = http.createServer((req, res) => {
  router(req, res);
});

const port = 3000;
server.listen(port, () => {
  console.log(`Servidor escutando na porta ${port}`);
});