/**
 * Theme constants shared by the build-time head renderer, the inline no-flash bootstrap
 * and the runtime theme module. Plain JS so Node (vite.config.js) can import it.
 */
export const THEME_STORAGE_KEY = 'root-theme';
export const THEMES = ['dark', 'light'];
/** Browser chrome colors — keep in sync with `--bg` in src/theme/theme.css. */
export const THEME_COLORS = { dark: '#060D1A', light: '#F4F7FB' };

/**
 * Inline script that runs before first paint so there is no flash of the wrong theme.
 * Order: saved explicit choice, otherwise LIGHT. The OS setting is deliberately not
 * consulted for an unconfigured visitor: the mandate requires Light even on dark OS.
 * If a future explicit System option is added, it may use prefers-color-scheme.
 */
export function themeBootstrapScript() {
  const colors = JSON.stringify(THEME_COLORS);
  return (
    `(function(){var d=document.documentElement,t='light';` +
    `try{var s=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});if(s==='light'||s==='dark')t=s}catch(e){}` +
    
    `d.setAttribute('data-theme',t);d.style.colorScheme=t;` +
    `var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute('content',${colors}[t]);})();`
  );
}
