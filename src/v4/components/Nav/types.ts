/** Single source-of-truth navigation interface consumed by the JS content model. */
export type NavItem = {
  label: string;
  href: string;
  description?: string;
  children?: NavItem[];
  isCTA?: boolean;
};
