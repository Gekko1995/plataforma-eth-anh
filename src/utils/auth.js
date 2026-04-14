import { LOCAL_USERS } from '../data/constants';

const AUTH_TIMEOUT_MS = 10_000;

/**
 * Autentica usuario a través del endpoint seguro del servidor.
 * Las credenciales viajan en el body JSON (POST), no en la URL.
 * En desarrollo, si el servidor no está disponible, usa usuarios locales.
 */
export async function authUser(email, password) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), AUTH_TIMEOUT_MS);

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      signal: controller.signal,
    });

    const data = await response.json().catch(() => null);

    // 400/401 son errores reales de credenciales — no hacer fallback
    if (response.status === 400 || response.status === 401) {
      return { ok: false, error: (data && data.error) || "Email o contraseña incorrectos" };
    }

    // 404 / 5xx / sin JSON válido = servidor no disponible o no configurado
    // En desarrollo, usar usuarios locales como respaldo
    if (!response.ok || !data) {
      if (process.env.NODE_ENV === "development") {
        const found = LOCAL_USERS.find(u => u.email === email && u.password === password);
        return found
          ? { ok: true, user: { email: found.email, nombre: found.nombre, rol: found.rol } }
          : { ok: false, error: "Email o contraseña incorrectos" };
      }
      return { ok: false, error: (data && data.error) || "Error de autenticacion" };
    }

    return data.success
      ? { ok: true, user: data.user }
      : { ok: false, error: data.error || "Email o contraseña incorrectos" };
  } catch (err) {
    if (err.name === "AbortError") {
      return { ok: false, error: "Tiempo de espera agotado. Intenta de nuevo." };
    }
    // Error de red (servidor Express no corriendo) — usar usuarios locales en desarrollo
    if (process.env.NODE_ENV === "development") {
      const found = LOCAL_USERS.find(u => u.email === email && u.password === password);
      return found
        ? { ok: true, user: { email: found.email, nombre: found.nombre, rol: found.rol } }
        : { ok: false, error: "Email o contraseña incorrectos" };
    }
    return { ok: false, error: "Error de conexion" };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Guarda registro de acceso en localStorage
 */
export function addLog(user, module) {
  const log = JSON.parse(localStorage.getItem("eth_log") || "[]");
  log.unshift({
    user: user.email,
    nombre: user.nombre,
    rol: user.rol,
    modulo: module,
    ts: new Date().toISOString()
  });
  localStorage.setItem("eth_log", JSON.stringify(log.slice(0, 300)));
}

/**
 * Obtiene registros de acceso
 */
export function getLogs() {
  return JSON.parse(localStorage.getItem("eth_log") || "[]");
}

/**
 * Limpia registros de acceso
 */
export function clearLogs() {
  localStorage.removeItem("eth_log");
}

/**
 * Crea un nuevo usuario a través del endpoint seguro del servidor.
 */
export async function createUser({ nombre, email, password, rol }) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10_000);
  try {
    const response = await fetch("/api/users/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email, password, rol }),
      signal: controller.signal,
    });
    const data = await response.json().catch(() => null);
    if (!response.ok || !data) {
      return { ok: false, error: (data && data.error) || "Error al crear el usuario" };
    }
    return data.success ? { ok: true } : { ok: false, error: data.error || "Error al crear el usuario" };
  } catch (err) {
    if (err.name === "AbortError") {
      return { ok: false, error: "Tiempo de espera agotado. Intenta de nuevo." };
    }
    return { ok: false, error: "Error de conexión" };
  } finally {
    clearTimeout(timer);
  }
}
