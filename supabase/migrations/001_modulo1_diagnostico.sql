-- ============================================================
-- Módulo 1.0 — Línea Diagnóstica Territorial
-- Ley 1581/2012 Habeas Data · MSPI Res. 02277/2025
-- ============================================================

-- Fichas territoriales por municipio
CREATE TABLE IF NOT EXISTS diagnostico_fichas (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  municipio              TEXT NOT NULL,
  departamento           TEXT NOT NULL,
  region                 TEXT,
  poblacion_total        INTEGER CHECK (poblacion_total >= 0),
  actividad_economica    TEXT,
  presencia_institucional TEXT[],
  nivel_conflictividad   TEXT CHECK (nivel_conflictividad IN ('bajo','medio','alto','critico')),
  observaciones          TEXT,
  created_by             UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Actores territoriales (vinculados a una ficha)
CREATE TABLE IF NOT EXISTS diagnostico_actores (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ficha_id         UUID REFERENCES diagnostico_fichas(id) ON DELETE CASCADE,
  nombre           TEXT NOT NULL,
  tipo             TEXT CHECK (tipo IN ('institucional','comunitario','privado','internacional','otro')),
  nivel_influencia INTEGER CHECK (nivel_influencia BETWEEN 1 AND 5),
  municipio        TEXT,
  contacto         TEXT,
  notas            TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Variables de conflictividad (vinculadas a una ficha)
CREATE TABLE IF NOT EXISTS diagnostico_conflictividad (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ficha_id    UUID REFERENCES diagnostico_fichas(id) ON DELETE CASCADE,
  categoria   TEXT NOT NULL,
  variable    TEXT NOT NULL,
  nivel       TEXT CHECK (nivel IN ('bajo','medio','alto','critico')),
  descripcion TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_actores_ficha ON diagnostico_actores(ficha_id);
CREATE INDEX IF NOT EXISTS idx_conflicto_ficha ON diagnostico_conflictividad(ficha_id);

-- Trigger: updated_at automático en fichas
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS set_fichas_updated_at ON diagnostico_fichas;
CREATE TRIGGER set_fichas_updated_at
  BEFORE UPDATE ON diagnostico_fichas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE diagnostico_fichas         ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnostico_actores        ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnostico_conflictividad ENABLE ROW LEVEL SECURITY;

-- Políticas: lectura para autenticados, escritura solo propietario o admin
CREATE POLICY "select_fichas"         ON diagnostico_fichas         FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "insert_fichas"         ON diagnostico_fichas         FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "update_fichas"         ON diagnostico_fichas         FOR UPDATE USING (created_by = auth.uid());
CREATE POLICY "delete_fichas"         ON diagnostico_fichas         FOR DELETE USING (created_by = auth.uid());

CREATE POLICY "select_actores"        ON diagnostico_actores        FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "insert_actores"        ON diagnostico_actores        FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "delete_actores"        ON diagnostico_actores        FOR DELETE USING (auth.uid() IS NOT NULL);

CREATE POLICY "select_conflictividad" ON diagnostico_conflictividad FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "insert_conflictividad" ON diagnostico_conflictividad FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "delete_conflictividad" ON diagnostico_conflictividad FOR DELETE USING (auth.uid() IS NOT NULL);
