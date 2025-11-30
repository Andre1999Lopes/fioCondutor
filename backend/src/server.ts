import cors from 'cors'
import express from 'express'
import routes from './routes'

const app = express()
const port = process.env.PORT || 3000

// Middlewares
app.use(cors())
app.use(express.json())

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'API Fio Condutor funcionando!',
    timestamp: new Date().toISOString(),
    endpoints: {
      alunos: '/api/alunos',
      turmas: '/api/turmas', 
      matriculas: '/api/matriculas',
      planos: '/api/planos',
      pagamentos: '/api/pagamentos',
      dashboard: '/api/dashboard'
    }
  })
})

// Todas as rotas da API
app.use('/api', routes)

// Rota padrão
app.get('/', (req, res) => {
  res.redirect('/health')
})

// Middleware de erro 404
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' })
})

// Iniciar servidor
app.listen(port, () => {
  console.log(`🚀 Servidor rodando na porta ${port}`)
  console.log(`📊 Health check: http://localhost:${port}/health`)
  console.log(`👥 Alunos: http://localhost:${port}/api/alunos`)
  console.log(`🏫 Turmas: http://localhost:${port}/api/turmas`)
  console.log(`📚 Matrículas: http://localhost:${port}/api/matriculas`)
  console.log(`💰 Planos: http://localhost:${port}/api/planos`)
  console.log(`💳 Pagamentos: http://localhost:${port}/api/pagamentos`)
  console.log(`📈 Dashboard: http://localhost:${port}/api/dashboard`)
})