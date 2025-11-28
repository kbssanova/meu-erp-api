// src/server.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rota de teste
app.get('/', (req: Request, res: Response) => {
  res.json({ 
    message: 'ERP API está rodando! 🚀',
    version: '1.0.0',
    status: 'online'
  });
});

// Rota de health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// ===== ROTAS DE AUTENTICAÇÃO =====
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  if (email === 'admin@erp.com' && password === 'admin123') {
    res.json({
      success: true,
      token: 'fake-jwt-token-123',
      user: {
        id: 1,
        name: 'Administrador',
        email: email,
        role: 'admin'
      }
    });
  } else {
    res.status(401).json({ success: false, message: 'Credenciais inválidas' });
  }
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, password, module } = req.body;
  
  res.json({
    success: true,
    message: 'Usuário criado com sucesso',
    user: { id: Date.now(), name, email, module }
  });
});

// ===== ROTAS DE CLIENTES =====
app.get('/api/clients', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: [
      { id: 1, name: 'João Silva', email: 'joao@email.com', phone: '11999999999' },
      { id: 2, name: 'Maria Santos', email: 'maria@email.com', phone: '11988888888' }
    ]
  });
});

app.post('/api/clients', (req: Request, res: Response) => {
  const { name, email, phone, cpf } = req.body;
  
  res.json({
    success: true,
    message: 'Cliente cadastrado com sucesso',
    data: { id: Date.now(), name, email, phone, cpf }
  });
});

app.get('/api/clients/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  
  res.json({
    success: true,
    data: { id, name: 'João Silva', email: 'joao@email.com' }
  });
});

app.put('/api/clients/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;
  
  res.json({
    success: true,
    message: 'Cliente atualizado com sucesso',
    data: { id, ...updates }
  });
});

app.delete('/api/clients/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  
  res.json({
    success: true,
    message: 'Cliente removido com sucesso'
  });
});

// ===== ROTAS DE ASSINATURAS =====
app.get('/api/subscriptions/check/:userId', (req: Request, res: Response) => {
  const { userId } = req.params;
  
  const subscription = {
    userId,
    plan: 'professional',
    status: 'active',
    expiresAt: '2025-12-31',
    daysRemaining: 36
  };
  
  res.json({
    success: true,
    data: subscription,
    isBlocked: subscription.status === 'blocked'
  });
});

app.post('/api/subscriptions/validate', (req: Request, res: Response) => {
  const { userId } = req.body;
  
  const isValid = true;
  
  if (!isValid) {
    res.status(403).json({
      success: false,
      message: 'Assinatura vencida. Renovar para continuar usando o sistema.',
      blocked: true
    });
  } else {
    res.json({ success: true, message: 'Assinatura ativa' });
  }
});

// ===== ROTAS DE DASHBOARD =====
app.get('/api/dashboard/stats', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      totalClients: 45,
      activeSubscriptions: 12,
      monthlyRevenue: 1680.00,
      pendingPayments: 3
    }
  });
});

// ===== MÓDULO DENTISTA =====
app.get('/api/dental/appointments', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: [
      { id: 1, patient: 'João Silva', date: '2025-11-26', time: '14:00', procedure: 'Limpeza' },
      { id: 2, patient: 'Maria Santos', date: '2025-11-26', time: '15:30', procedure: 'Canal' }
    ]
  });
});

app.post('/api/dental/appointments', (req: Request, res: Response) => {
  const { patientId, date, time, procedure } = req.body;
  
  res.json({
    success: true,
    message: 'Consulta agendada com sucesso',
    data: { id: Date.now(), patientId, date, time, procedure }
  });
});

// ===== MÓDULO MECÂNICA =====
app.get('/api/mechanic/workorders', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: [
      { id: 1, vehicle: 'Fiat Uno', plate: 'ABC-1234', service: 'Troca de óleo', status: 'Em andamento' },
      { id: 2, vehicle: 'VW Gol', plate: 'XYZ-9876', service: 'Revisão', status: 'Aguardando peças' }
    ]
  });
});

app.post('/api/mechanic/workorders', (req: Request, res: Response) => {
  const { vehicleId, services, description } = req.body;
  
  res.json({
    success: true,
    message: 'Ordem de serviço criada',
    data: { id: Date.now(), vehicleId, services, description, status: 'Aberta' }
  });
});

// ===== MÓDULO LOJA =====
app.get('/api/store/products', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: [
      { id: 1, name: 'Produto A', price: 99.90, stock: 15, category: 'Eletrônicos' },
      { id: 2, name: 'Produto B', price: 49.90, stock: 8, category: 'Acessórios' }
    ]
  });
});

app.post('/api/store/sales', (req: Request, res: Response) => {
  const { items, total, paymentMethod } = req.body;
  
  res.json({
    success: true,
    message: 'Venda registrada com sucesso',
    data: { id: Date.now(), items, total, paymentMethod, date: new Date() }
  });
});

// Middleware de erro
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📝 Acesse: http://localhost:${PORT}`);
});

export default app;