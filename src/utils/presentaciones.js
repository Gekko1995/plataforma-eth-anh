import { supabase } from '../lib/supabase';

/**
 * Obtiene la presentación de un módulo.
 * Retorna { ok, data } — data puede ser null si no existe todavía.
 */
export async function getPresentacion(moduloId) {
  if (!supabase) return { ok: false, error: 'Sin conexión a Supabase.' };
  const { data, error } = await supabase
    .from('presentaciones')
    .select('*')
    .eq('modulo_id', moduloId)
    .maybeSingle();
  if (error) return { ok: false, error: error.message };
  return { ok: true, data };
}

/**
 * Guarda (crea o actualiza) la presentación de un módulo.
 */
export async function savePresentacion({ moduloId, titulo, bloques, userId }) {
  if (!supabase) return { ok: false, error: 'Sin conexión a Supabase.' };

  // Ver si ya existe
  const { data: existing } = await supabase
    .from('presentaciones')
    .select('id')
    .eq('modulo_id', moduloId)
    .maybeSingle();

  const payload = {
    modulo_id: moduloId,
    titulo:    titulo || 'Presentación',
    bloques:   bloques || [],
    actualizado_en: new Date().toISOString(),
  };

  let error;
  if (existing?.id) {
    ({ error } = await supabase
      .from('presentaciones')
      .update(payload)
      .eq('id', existing.id));
  } else {
    ({ error } = await supabase
      .from('presentaciones')
      .insert({ ...payload, creado_por: userId }));
  }

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

/**
 * Elimina la presentación de un módulo.
 */
export async function deletePresentacion(moduloId) {
  if (!supabase) return { ok: false, error: 'Sin conexión a Supabase.' };
  const { error } = await supabase
    .from('presentaciones')
    .delete()
    .eq('modulo_id', moduloId);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
