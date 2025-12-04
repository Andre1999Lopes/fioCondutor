import cors from 'cors';
import express from 'express';
import routes from './routes';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT;
const frontOrigin = process.env.FRONT_URL;

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: frontOrigin,
    credentials: true
  })
);

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

app.use('/api', routes);

app.get('/', (req, res) => {
  res.redirect('/health');
});

app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

app.listen(port, () => {
  console.log(`🚀 Servidor rodando na porta ${port}`);
  console.log(`📊 Health check: http://localhost:${port}/health`);
  console.log(`👥 Alunos: http://localhost:${port}/api/alunos`);
  console.log(`🏫 Turmas: http://localhost:${port}/api/turmas`);
  console.log(`📚 Matrículas: http://localhost:${port}/api/matriculas`);
  console.log(`💰 Planos: http://localhost:${port}/api/planos`);
  console.log(`💳 Pagamentos: http://localhost:${port}/api/pagamentos`);
  console.log(`📈 Dashboard: http://localhost:${port}/api/dashboard`);
});
