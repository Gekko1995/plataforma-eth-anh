import { useEffect, useRef, useState, useCallback } from 'react';

const IDLE_MS   = 14 * 60 * 1000; // 14 min sin actividad → aviso
const WARN_SECS = 60;              // 60 seg de cuenta regresiva antes de cerrar

const EVENTS = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];

export function useIdleTimeout({ onLogout, enabled = true }) {
  const [showWarning, setShowWarning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(WARN_SECS);

  const idleRef    = useRef(null);
  const countRef   = useRef(null);
  const warningRef = useRef(false); // ref síncrona para el event handler (evita stale closure)

  const doLogout = useCallback(() => {
    clearTimeout(idleRef.current);
    clearInterval(countRef.current);
    onLogout();
  }, [onLogout]);

  const startCountdown = useCallback(() => {
    warningRef.current = true;
    setShowWarning(true);
    let s = WARN_SECS;
    setSecondsLeft(s);
    countRef.current = setInterval(() => {
      s -= 1;
      setSecondsLeft(s);
      if (s <= 0) {
        clearInterval(countRef.current);
        doLogout();
      }
    }, 1000);
  }, [doLogout]);

  const resetTimer = useCallback(() => {
    clearTimeout(idleRef.current);
    clearInterval(countRef.current);
    warningRef.current = false;
    setShowWarning(false);
    setSecondsLeft(WARN_SECS);
    if (enabled) {
      idleRef.current = setTimeout(startCountdown, IDLE_MS);
    }
  }, [enabled, startCountdown]);

  useEffect(() => {
    if (!enabled) return;

    const handleActivity = () => {
      if (warningRef.current) return; // durante el aviso solo el botón puede resetear
      clearTimeout(idleRef.current);
      idleRef.current = setTimeout(startCountdown, IDLE_MS);
    };

    EVENTS.forEach(e => window.addEventListener(e, handleActivity, { passive: true }));
    idleRef.current = setTimeout(startCountdown, IDLE_MS);

    return () => {
      EVENTS.forEach(e => window.removeEventListener(e, handleActivity));
      clearTimeout(idleRef.current);
      clearInterval(countRef.current);
    };
  }, [enabled, startCountdown]);

  return { showWarning, secondsLeft, resetTimer };
}
