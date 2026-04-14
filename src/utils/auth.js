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
    if (!data) {
      return { ok: false, error: response.ok ? "Respuesta invalida del servidor" : "Error de autenticacion" };
    }

    if (!response.ok) {
      return { ok: false, error: data.error || "Credenciales incorrectas" };
    }
    return data.success
      ? { ok: true, user: data.user }
      : { ok: false, error: data.error || "Credenciales incorrectas" };
  } catch (err) {
    if (err.name === "AbortError") {
      return { ok: false, error: "Tiempo de espera agotado. Intenta de nuevo." };
    }
    // Fallback local solo en desarrollo (cuando el servidor Express no corre junto a npm start)
    if (process.env.NODE_ENV === "development") {
      const found = LOCAL_USERS.find(u => u.email === email && u.password === password);
      return found
        ? { ok: true, user: { email: found.email, nombre: found.nombre, rol: found.rol } }
        : { ok: false, error: "Email o contrasena incorrectos" };
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
