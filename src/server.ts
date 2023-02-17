import http from 'http';
import { router } from './modules/users/http/routes/user.routes';

const server = http.createServer((req, res) => {
  router(req, res);
});

const port = 3000;
server.listen(port, () => {
  console.log(`Servidor escutando na porta ${port}`);
});