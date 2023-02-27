import 'reflect-metadata';
import http from 'http';
import { router } from './shared/router/router';
import './shared/container';

const server = http.createServer((req, res) => {
  router(req, res);
});

const port = 3000;
server.listen(port, () => {
  console.log(`Servidor escutando na porta ${port}`);
});