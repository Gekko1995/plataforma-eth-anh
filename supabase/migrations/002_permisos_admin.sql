-- =====================================================================
-- MIGRACIÓN 002: Tabla permisos_admin + función is_super_root
-- Convenio ETH-ANH 2026
-- Aplicar en: Supabase > SQL Editor
-- =====================================================================

-- Función para verificar super_root
CREATE OR REPLACE FUNCTION public.is_super_root(uid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = uid AND rol = 'super_root'
  );
$$;

-- Tabla de permisos configurables por admin
CREATE TABLE IF NOT EXISTS public.permisos_admin (
  admin_id                  uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  puede_crear_usuarios      boolean NOT NULL DEFAULT false,
  puede_eliminar_usuarios   boolean NOT NULL DEFAULT false,
  puede_modificar_usuarios  boolean NOT NULL DEFAULT false,
  puede_cambiar_password    boolean NOT NULL DEFAULT false,
  puede_activar_desactivar  boolean NOT NULL DEFAULT false,
  puede_ver_historial       boolean NOT NULL DEFAULT false,
  puede_gestionar_permisos  boolean NOT NULL DEFAULT false,
  updated_by                uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  updated_at                timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.permisos_admin ENABLE ROW LEVEL SECURITY;

-- El admin ve sus propios permisos; super_root ve todos
CREATE POLICY "permisos_admin_select"
ON public.permisos_admin FOR SELECT
USING (
  auth.uid() = admin_id
  OR public.is_super_root(auth.uid())
);

-- Solo super_root puede crear/modificar/eliminar registros
CREATE POLICY "permisos_admin_insert"
ON public.permisos_admin FOR INSERT
TO authenticated
WITH CHECK (public.is_super_root(auth.uid()));

CREATE POLICY "permisos_admin_update"
ON public.permisos_admin FOR UPDATE
USING (public.is_super_root(auth.uid()))
WITH CHECK (public.is_super_root(auth.uid()));

CREATE POLICY "permisos_admin_delete"
ON public.permisos_admin FOR DELETE
USING (public.is_super_root(auth.uid()));
