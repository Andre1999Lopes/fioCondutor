const http = require('http');
const next = require('next');

const port = parseInt(process.env.PORT || '3000', 10);
const app = next({ dev: false });
const handle = app.getRequestHandler();

app.prepare()
  .then(() => {
    const server = http.createServer((req, res) => {
      return handle(req, res);
    });

    server.listen(port, (err) => {
      if (err) {
        console.error('Erro ao iniciar o servidor do frontend:', err);
        process.exit(1);
      }
      console.log(`Frontend Next.js rodando em http://localhost:${port}`);
    });

    const shutdown = (signal) => {
      console.warn(`Recebido ${signal}. Finalizando servidor do frontend...`);
      server.close(() => {
        console.log('Servidor do frontend finalizado.');
        process.exit(0);
      });
      setTimeout(() => {
        console.error('Encerramento forçado do processo do frontend.');
        process.exit(1);
      }, 5000).unref();
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  })
  .catch((err) => {
    console.error('Erro ao preparar o app Next:', err);
    process.exit(1);
  });
