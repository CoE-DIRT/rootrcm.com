/**
 * Theme constants shared by the build-time head renderer, the inline no-flash bootstrap
 * and the runtime theme module. Plain JS so Node (vite.config.js) can import it.
 */
export const THEME_STORAGE_KEY = 'root-theme';
export const THEMES = ['dark', 'light'];
/** Browser chrome colors — keep in sync with `--bg` in src/theme/theme.css. */
export const THEME_COLORS = { dark: '#07110e', light: '#f4f7f5' };

/**
 * Inline script that runs before first paint so there is no flash of the wrong theme.
 * Order: saved choice, then the OS preference, then dark (the brand default).
 */
export function themeBootstrapScript() {
  const colors = JSON.stringify(THEME_COLORS);
  return (
    `(function(){var d=document.documentElement,t;` +
    `try{var s=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});if(s==='light'||s==='dark')t=s}catch(e){}` +
    `if(!t){try{t=matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'}catch(e){t='dark'}}` +
    `d.setAttribute('data-theme',t);d.style.colorScheme=t;` +
    `var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute('content',${colors}[t]);})();`
  );
}
