-- COLE NO SUPABASE SQL EDITOR

-- 1. Adicionar coluna photo_url na tabela students
ALTER TABLE students ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- 2. Criar bucket para fotos (execute no Storage, não no SQL Editor)
-- Vá em Storage > Create Bucket
-- Nome: student-photos
-- Public: true (marque a opção)
