import { useState, useEffect } from 'react';
import { GROUPS } from '../data/constants';
import { getPermisosUsuario } from '../utils/auth';

/**
 * Devuelve los módulos que el usuario puede ver.
 * - admin: todos los módulos de todos los grupos
 * - cualquier otro rol: solo los módulos con puede_ver === true en permisos_modulos
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

    if (user.rol === 'admin') {
      // Admin ve todo sin consultar la base de datos
      const todos = GROUPS.flatMap(g =>
        g.modules.map(m => ({ ...m, grupoId: g.id, grupoName: g.name, grupoColor: g.color }))
      );
      setModulosVisibles(todos);
      setLoading(false);
      return;
    }

    // Para cualquier otro rol, consultamos permisos_modulos
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

      // Construir un Set con los modulo_id que tienen puede_ver === true
      const permitidos = new Set(
        (result.data || [])
          .filter(p => p.puede_ver === true)
          .map(p => p.modulo_id)
      );

      const visibles = GROUPS.flatMap(g =>
        g.modules
          .filter(m => permitidos.has(m.id))
          .map(m => ({ ...m, grupoId: g.id, grupoName: g.name, grupoColor: g.color }))
      );

      setModulosVisibles(visibles);
      setLoading(false);
    }

    cargar();

    return () => {
      cancelled = true;
    };
  }, [user?.id, user?.rol]);

  return { modulosVisibles, loading, error };
}
