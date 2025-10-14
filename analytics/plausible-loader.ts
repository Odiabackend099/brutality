const PLAUSIBLE_DOMAIN =
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_PLAUSIBLE_DOMAIN) ||
  (typeof process !== 'undefined' && process.env?.REACT_APP_PLAUSIBLE_DOMAIN) ||
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_PLAUSIBLE_DOMAIN) ||
  '';

let scriptLoaded = false;

/**
 * Injects the Plausible script tag once per session.
 * Falls back gracefully when no domain is configured.
 */
export function initPlausible() {
  if (scriptLoaded) return;
  if (typeof window === 'undefined') return;
  if (!PLAUSIBLE_DOMAIN) return;

  const existing = document.querySelector<HTMLScriptElement>('script[data-plausible-domain]');
  if (existing) {
    scriptLoaded = true;
    return;
  }

  const script = document.createElement('script');
  script.defer = true;
  script.dataset.domain = PLAUSIBLE_DOMAIN;
  script.src = `https://plausible.io/js/script.js`;
  script.setAttribute('data-plausible-domain', PLAUSIBLE_DOMAIN);
  document.head.appendChild(script);

  scriptLoaded = true;
}

/**
 * Safe Plausible event trigger. No-ops when script missing.
 */
export function trackPlausible(eventName: string, props?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  const plausible = (window as any).plausible;
  if (typeof plausible === 'function') {
    plausible(eventName, { props });
  }
}

export function getPlausibleDomain() {
  return PLAUSIBLE_DOMAIN;
}
