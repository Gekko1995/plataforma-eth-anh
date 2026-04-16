import { useState, useEffect } from 'react';
import { GROUPS } from '../data/constants';
import { getPermisosUsuario } from '../utils/auth';

/**
 * Devuelve los módulos que el usuario puede ver.
 * - super_root: todos los módulos siempre (sin consultar BD)
 * - admin: todos por defecto, a menos que super_root haya restringido alguno
 * - otros roles: solo los módulos con puede_ver === true en permisos_modulos
 */
export function useModulosVisibles(user) {
  const [modulosVisibles, setModulosVisibles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setModulosVisibles([]);
      setLoading(false);
      return;
    }

    // super_root ve todo sin consultar la base de datos
    if (user.rol === 'super_root') {
      const todos = GROUPS.flatMap(g =>
        g.modules.map(m => ({ ...m, grupoId: g.id, grupoName: g.name, grupoColor: g.color }))
      );
      setModulosVisibles(todos);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function cargar() {
      setLoading(true);
      setError(null);

      const result = await getPermisosUsuario(user.id);

      if (cancelled) return;

      if (!result.ok) {
        setError(result.error || 'No se pudieron cargar los permisos.');
        setModulosVisibles([]);
        setLoading(false);
        return;
      }

      // Construir mapa modulo_id → puede_ver
      const mapaPermisos = {};
      (result.data || []).forEach(p => { mapaPermisos[p.modulo_id] = p.puede_ver; });

      const visibles = GROUPS.flatMap(g =>
        g.modules
          .filter(m => {
            // Para admins: visible por defecto (true) a menos que esté explícitamente en false
            if (user.rol === 'admin') {
              return mapaPermisos[m.id] !== false;
            }
            // Para otros roles: solo si está explícitamente en true
            return mapaPermisos[m.id] === true;
          })
          .map(m => ({ ...m, grupoId: g.id, grupoName: g.name, grupoColor: g.color }))
      );

      setModulosVisibles(visibles);
      setLoading(false);
    }

    cargar();

    return () => { cancelled = true; };
  }, [user?.id, user?.rol]);

  return { modulosVisibles, loading, error };
}
