-- =====================================================================
-- Migración 002: columnas activo y debe_cambiar_password en profiles
-- Ejecutar en Supabase SQL Editor
-- =====================================================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS activo boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS debe_cambiar_password boolean DEFAULT false;

-- Actualizar usuarios existentes: ya activos, no necesitan cambiar password
UPDATE public.profiles SET activo = true WHERE activo IS NULL;
UPDATE public.profiles SET debe_cambiar_password = false WHERE debe_cambiar_password IS NULL;
