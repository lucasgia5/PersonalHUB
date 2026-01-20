-- COLE NO SUPABASE SQL EDITOR

-- Tabela para armazenar tokens de compra
CREATE TABLE IF NOT EXISTS purchase_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  plan_type TEXT NOT NULL,
  stripe_session_id TEXT,
  used BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para busca rápida por token
CREATE INDEX IF NOT EXISTS idx_purchase_tokens_token ON purchase_tokens(token);
CREATE INDEX IF NOT EXISTS idx_purchase_tokens_email ON purchase_tokens(email);

-- Habilitar RLS
ALTER TABLE purchase_tokens ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura pública de tokens não usados e não expirados
CREATE POLICY "Anyone can read valid tokens" ON purchase_tokens 
  FOR SELECT USING (used = false AND expires_at > NOW());

-- Política para inserção via service role (backend)
CREATE POLICY "Service can insert tokens" ON purchase_tokens 
  FOR INSERT WITH CHECK (true);

-- Política para atualização via service role
CREATE POLICY "Service can update tokens" ON purchase_tokens 
  FOR UPDATE USING (true);
