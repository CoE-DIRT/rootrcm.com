/// <reference types="vite/client" />

declare module 'klaro' {
  const Klaro: {
    setup: (config: unknown) => void;
    show: (config: unknown, modal?: boolean) => void;
    getManager: (config: unknown) => { watch: (watcher: unknown) => void };
  };
  export default Klaro;
}
