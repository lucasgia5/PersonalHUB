# 🏋️ PersonalHub - App para Personal Trainers

## ⚠️ AÇÃO NECESSÁRIA: Configure o Supabase

Antes de testar o aplicativo, você precisa configurar as tabelas no Supabase. **Isso leva apenas 2 minutos!**

### Passo 1: Criar Usuário de Teste

1. Acesse: https://oacxcncjmftqtneeabdz.supabase.co
2. Vá em **Authentication** > **Users** (menu lateral esquerdo)
3. Clique em **Add user** > **Create new user**
4. Preencha:
   - Email: `teste@gmail.com`
   - Password: `teste`
   - ✅ **IMPORTANTE**: Marque a opção **Auto Confirm User**
5. Clique em **Create user**

### Passo 2: Criar Tabelas no Banco

1. No mesmo projeto Supabase, vá em **SQL Editor** (menu lateral esquerdo)
2. Clique em **New query**
3. **Cole todo o SQL abaixo** e clique em **RUN** (ou pressione Ctrl+Enter):

```sql
-- Tabela de Alunos
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INTEGER,
  goal TEXT,
  observations TEXT,
  initial_weight DECIMAL(5,2),
  height DECIMAL(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Treinos
CREATE TABLE IF NOT EXISTS workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Exercícios do Treino
CREATE TABLE IF NOT EXISTS exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workout_id UUID NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sets INTEGER,
  reps TEXT,
  weight TEXT,
  rest TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Histórico de Exercício
CREATE TABLE IF NOT EXISTS exercise_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  weight TEXT,
  sets INTEGER,
  reps TEXT,
  observations TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Cardio
CREATE TABLE IF NOT EXISTS cardio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  equipment TEXT NOT NULL,
  duration INTEGER,
  intensity TEXT,
  observations TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Evolução
CREATE TABLE IF NOT EXISTS evolution (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  current_weight DECIMAL(5,2),
  observations TEXT,
  performance TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar Row Level Security
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE cardio ENABLE ROW LEVEL SECURITY;
ALTER TABLE evolution ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para Students
CREATE POLICY "Users can view own students" ON students FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create students" ON students FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own students" ON students FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own students" ON students FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para Workouts
CREATE POLICY "Users can view own workouts" ON workouts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create workouts" ON workouts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own workouts" ON workouts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own workouts" ON workouts FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para Exercises
CREATE POLICY "Users can view own exercises" ON exercises FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create exercises" ON exercises FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own exercises" ON exercises FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own exercises" ON exercises FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para Exercise History
CREATE POLICY "Users can view own exercise history" ON exercise_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create exercise history" ON exercise_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own exercise history" ON exercise_history FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own exercise history" ON exercise_history FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para Cardio
CREATE POLICY "Users can view own cardio" ON cardio FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create cardio" ON cardio FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own cardio" ON cardio FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own cardio" ON cardio FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para Evolution
CREATE POLICY "Users can view own evolution" ON evolution FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create evolution" ON evolution FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own evolution" ON evolution FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own evolution" ON evolution FOR DELETE USING (auth.uid() = user_id);
```

### Passo 3: Verificar ✅

1. Vá em **Table Editor** (menu lateral)
2. Confirme que as 6 tabelas foram criadas:
   - ✅ students
   - ✅ workouts
   - ✅ exercises
   - ✅ exercise_history
   - ✅ cardio
   - ✅ evolution

3. Vá em **Authentication** > **Users** 
4. Confirme que o usuário `teste@gmail.com` existe

---

## 🎯 Como Testar o App

Após configurar o Supabase:

1. **Acesse o app**: https://trainerpro-17.preview.emergentagent.com

2. **Faça login**:
   - Email: `teste@gmail.com`
   - Senha: `teste`

3. **Teste as funcionalidades**:
   - ✅ Adicionar alunos
   - ✅ Ver perfil do aluno
   - ✅ Criar treinos
   - ✅ Adicionar exercícios ao treino
   - ✅ Ver histórico de cada exercício
   - ✅ Adicionar cardio
   - ✅ Registrar evolução

---

## 🏗️ Arquitetura

- **Frontend**: React + Tailwind CSS + shadcn/ui
- **Backend**: FastAPI + Python
- **Banco de Dados**: Supabase (PostgreSQL)
- **Autenticação**: Supabase Auth
- **Segurança**: Row Level Security (RLS)

---

## 📂 Estrutura do Projeto

```
/app
├── backend/
│   ├── server.py          # API FastAPI com todos os endpoints
│   ├── .env               # Credenciais do Supabase
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Dashboard.js
│   │   │   └── StudentProfile.js
│   │   ├── contexts/
│   │   │   └── AuthContext.js
│   │   ├── lib/
│   │   │   └── supabaseClient.js
│   │   └── App.js
│   └── .env
└── SUPABASE_SETUP.md
```

---

## 🚀 Features Implementadas

### Autenticação
- ✅ Login com email/senha
- ✅ Proteção de rotas
- ✅ Logout

### Gestão de Alunos
- ✅ Listar alunos
- ✅ Adicionar aluno
- ✅ Ver perfil completo do aluno
- ✅ Campos: nome, idade, objetivo, peso, altura, observações

### Treinos
- ✅ Criar treinos para alunos
- ✅ Adicionar exercícios ao treino
- ✅ Editar/excluir exercícios
- ✅ Campos: nome, séries, repetições, carga, descanso

### Histórico de Exercícios
- ✅ Registrar histórico semanal por exercício
- ✅ Ver evolução de carga/séries/reps ao longo do tempo
- ✅ Adicionar observações em cada registro

### Cardio
- ✅ Registrar cardio dos alunos
- ✅ Equipamentos: esteira, bike, elíptico, corda, escada, livre
- ✅ Campos: tempo, intensidade, observações

### Evolução
- ✅ Registrar evolução geral do aluno
- ✅ Acompanhar peso, performance e observações
- ✅ Histórico cronológico

### Segurança
- ✅ Row Level Security (RLS) no Supabase
- ✅ Cada usuário vê apenas seus dados
- ✅ Autenticação via JWT

---

## 🎨 Design

- Cores: Azul (#2563EB) e Verde (#16A34A)
- Fontes: Manrope (títulos) + Inter (texto)
- Interface moderna e mobile-friendly
- Componentes shadcn/ui
- Tema fitness profissional

---

## 💡 Próximos Passos (Melhorias Futuras)

- 📊 Gráficos de evolução
- 📱 Acesso do aluno (visualização)
- 📄 Relatórios em PDF
- 🤖 IA para sugestão de progressão de carga
- 💳 Planos pagos
- 📸 Upload de fotos de progresso
- ⏰ Agendamento de treinos

---

## ❓ Problemas?

Se encontrar algum erro:
1. Verifique se criou o usuário `teste@gmail.com` no Supabase Auth
2. Confirme que as 6 tabelas foram criadas no SQL Editor
3. Verifique os logs: `tail -n 50 /var/log/supervisor/backend.err.log`
