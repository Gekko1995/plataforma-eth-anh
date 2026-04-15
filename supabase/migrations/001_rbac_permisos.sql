-- =====================================================================
-- MIGRACIÓN 001: RBAC - Rol Gestor de Contenido + Tabla permisos_modulos
-- Convenio ETH-ANH 2026
-- Aplicar en: Supabase > SQL Editor
-- =====================================================================


-- ---------------------------------------------------------------------
-- PASO 1: Ampliar el CHECK constraint de rol en profiles
-- ---------------------------------------------------------------------

ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_rol_check;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_rol_check
  CHECK (rol IN ('admin', 'usuario', 'Gestor de Contenido'));

-- Cambiar el default al nuevo rol
ALTER TABLE public.profiles
  ALTER COLUMN rol SET DEFAULT 'Gestor de Contenido';


-- ---------------------------------------------------------------------
-- PASO 2: Actualizar el trigger para usar el nuevo default
-- ---------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, nombre, email, rol, grupo)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nombre', split_part(NEW.email, '@', 1)),
    NEW.email,
    CASE
      WHEN COALESCE(NEW.raw_user_meta_data->>'rol', '') IN ('admin', 'usuario', 'Gestor de Contenido')
        THEN NEW.raw_user_meta_data->>'rol'
      ELSE 'Gestor de Contenido'
    END,
    CASE
      WHEN COALESCE(NEW.raw_user_meta_data->>'grupo', '') IN ('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I')
        THEN NEW.raw_user_meta_data->>'grupo'
      ELSE 'A'
    END
  )
  ON CONFLICT (id) DO UPDATE
    SET nombre = EXCLUDED.nombre,
        email  = EXCLUDED.email;

  RETURN NEW;
END;
$$;


-- ---------------------------------------------------------------------
-- PASO 3: Crear tabla permisos_modulos
-- ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.permisos_modulos (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  modulo_id   integer NOT NULL CHECK (modulo_id BETWEEN 1 AND 39),
  grupo_id    text NOT NULL CHECK (grupo_id IN ('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I')),
  puede_ver   boolean NOT NULL DEFAULT false,
  updated_by  uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, modulo_id)
);

-- Índices para consultas frecuentes
CREATE INDEX IF NOT EXISTS idx_permisos_modulos_user_id   ON public.permisos_modulos(user_id);
CREATE INDEX IF NOT EXISTS idx_permisos_modulos_modulo_id ON public.permisos_modulos(modulo_id);


-- ---------------------------------------------------------------------
-- PASO 4: Habilitar RLS en permisos_modulos
-- ---------------------------------------------------------------------

ALTER TABLE public.permisos_modulos ENABLE ROW LEVEL SECURITY;

-- SELECT: el propio usuario ve sus permisos, el admin ve todos
CREATE POLICY "permisos_select_own_or_admin"
ON public.permisos_modulos
FOR SELECT
USING (
  auth.uid() = user_id
  OR public.is_admin(auth.uid())
);

-- INSERT: solo admins
CREATE POLICY "permisos_insert_admin_only"
ON public.permisos_modulos
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

-- UPDATE: solo admins
CREATE POLICY "permisos_update_admin_only"
ON public.permisos_modulos
FOR UPDATE
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- DELETE: solo admins
CREATE POLICY "permisos_delete_admin_only"
ON public.permisos_modulos
FOR DELETE
USING (public.is_admin(auth.uid()));


-- ---------------------------------------------------------------------
-- PASO 5: Función helper para verificar permiso de un módulo
-- Uso: SELECT public.user_puede_ver(auth.uid(), 5);
-- ---------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.user_puede_ver(uid uuid, mid integer)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT puede_ver
     FROM public.permisos_modulos
     WHERE user_id = uid AND modulo_id = mid),
    false
  );
$$;


-- =====================================================================
-- FIN DE MIGRACIÓN 001
-- =====================================================================
