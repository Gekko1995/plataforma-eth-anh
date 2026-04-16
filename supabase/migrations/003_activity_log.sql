-- =====================================================================
-- Migración 003: Historial de actividad de usuarios
-- Ejecutar en Supabase SQL Editor
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.activity_log (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid        REFERENCES public.profiles(id) ON DELETE SET NULL,
  user_email   text        NOT NULL,
  user_nombre  text        NOT NULL,
  user_rol     text        NOT NULL,
  accion       text        NOT NULL,
  detalle      text,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_activity_log_user_id    ON public.activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON public.activity_log(created_at DESC);

-- Habilitar RLS
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- Cualquier usuario autenticado puede insertar su propia actividad
CREATE POLICY "activity_log_insert_own"
ON public.activity_log
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Solo admins pueden leer el historial completo
CREATE POLICY "activity_log_select_admin"
ON public.activity_log
FOR SELECT
USING (public.is_admin(auth.uid()));

-- Solo admins pueden eliminar registros
CREATE POLICY "activity_log_delete_admin"
ON public.activity_log
FOR DELETE
USING (public.is_admin(auth.uid()));

-- =====================================================================
-- FIN DE MIGRACIÓN 003
-- =====================================================================
