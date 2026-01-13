# Configuração do Supabase para PersonalHub

## Passo 1: Criar Usuário de Teste

1. Acesse seu projeto Supabase: https://oacxcncjmftqtneeabdz.supabase.co
2. Vá em **Authentication** > **Users**
3. Clique em **Add user** > **Create new user**
4. Preencha:
   - Email: `teste@gmail.com`
   - Password: `teste`
   - Auto Confirm User: ✅ (marque esta opção)
5. Clique em **Create user**

## Passo 2: Criar Tabelas no Banco de Dados

1. Vá em **SQL Editor** no menu lateral
2. Clique em **New query**
3. Cole o SQL abaixo e execute:

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

-- Habilitar Row Level Security em todas as tabelas
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE cardio ENABLE ROW LEVEL SECURITY;
ALTER TABLE evolution ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para Students
CREATE POLICY "Users can view own students" ON students
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create students" ON students
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own students" ON students
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own students" ON students
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para Workouts
CREATE POLICY "Users can view own workouts" ON workouts
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create workouts" ON workouts
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own workouts" ON workouts
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own workouts" ON workouts
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para Exercises
CREATE POLICY "Users can view own exercises" ON exercises
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create exercises" ON exercises
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own exercises" ON exercises
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own exercises" ON exercises
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para Exercise History
CREATE POLICY "Users can view own exercise history" ON exercise_history
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create exercise history" ON exercise_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own exercise history" ON exercise_history
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own exercise history" ON exercise_history
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para Cardio
CREATE POLICY "Users can view own cardio" ON cardio
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create cardio" ON cardio
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own cardio" ON cardio
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own cardio" ON cardio
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para Evolution
CREATE POLICY "Users can view own evolution" ON evolution
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create evolution" ON evolution
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own evolution" ON evolution
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own evolution" ON evolution
  FOR DELETE USING (auth.uid() = user_id);
```

## Passo 3: Verificar

1. Vá em **Table Editor** e verifique se as 6 tabelas foram criadas:
   - students
   - workouts
   - exercises
   - exercise_history
   - cardio
   - evolution

2. Vá em **Authentication** > **Users** e confirme que o usuário `teste@gmail.com` existe

✅ Pronto! O banco de dados está configurado e pronto para uso.
