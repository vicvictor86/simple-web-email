import 'reflect-metadata';
import http from 'http';
import { router } from './router/router';
import { errorHandler } from './middlewares/ErrorHandler';
import '../../container';

const server = http.createServer(async (req, res) => {
  try {
    await router(req, res);
  } catch (err: any) {
    errorHandler(err, req, res);
  }
});

const port = 3000;
server.listen(port, () => {
  console.log(`Servidor escutando na porta ${port}`);
});