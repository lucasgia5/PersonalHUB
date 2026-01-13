-- ATUALIZAÇÕES NO BANCO DE DADOS - COLE NO SUPABASE SQL EDITOR

-- 1. Adicionar campo date no cardio (se não existir)
ALTER TABLE cardio ADD COLUMN IF NOT EXISTS date DATE DEFAULT CURRENT_DATE;

-- 2. Adicionar campo date no workouts para histórico
ALTER TABLE workouts ADD COLUMN IF NOT EXISTS date DATE;

-- 3. Criar tabela de rotina semanal
CREATE TABLE IF NOT EXISTS weekly_routine (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  workout_name TEXT NOT NULL,
  exercises JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Habilitar RLS na nova tabela
ALTER TABLE weekly_routine ENABLE ROW LEVEL SECURITY;

-- 5. Políticas RLS para weekly_routine
CREATE POLICY "Users can view own routine" ON weekly_routine FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create routine" ON weekly_routine FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own routine" ON weekly_routine FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own routine" ON weekly_routine FOR DELETE USING (auth.uid() = user_id);
