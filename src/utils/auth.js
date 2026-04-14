import { APPS_SCRIPT_URL, LOCAL_USERS } from '../data/constants';

/**
 * Autentica usuario contra Google Sheets o usuarios locales
 */
export async function authUser(email, password) {
  if (APPS_SCRIPT_URL) {
    try {
      const response = await fetch(
        `${APPS_SCRIPT_URL}?action=login&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
      );
      const data = await response.json();
      return data.success
        ? { ok: true, user: data.user }
        : { ok: false, error: data.error || "Credenciales incorrectas" };
    } catch {
      return { ok: false, error: "Error de conexion" };
    }
  }
  
  const found = LOCAL_USERS.find(u => u.email === email && u.password === password);
  return found
    ? { ok: true, user: { email: found.email, nombre: found.nombre, rol: found.rol } }
    : { ok: false, error: "Email o contrasena incorrectos" };
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
