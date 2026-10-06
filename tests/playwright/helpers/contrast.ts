import type { Page } from '@playwright/test';

export interface ContrastFailure {
  selector: string;
  text: string;
  ratio: number;
  required: number;
  fg: string;
  bg: string;
}

/**
 * WCAG 2.x text-contrast audit run inside the page. Backgrounds are composited from the element up through
 * its ancestors; elements sitting on gradients/images are skipped (they are checked visually via screenshots).
 */
export async function auditContrast(page: Page): Promise<ContrastFailure[]> {
  return page.evaluate(() => {
    type RGBA = [number, number, number, number];

    const parse = (value: string): RGBA | null => {
      const match = value.match(/rgba?\(([^)]+)\)/);
      if (match) {
        const parts = match[1].split(/[ ,/]+/).filter(Boolean).map(Number);
        return [parts[0], parts[1], parts[2], parts[3] === undefined ? 1 : parts[3]];
      }
      const srgb = value.match(/color\(srgb ([^)]+)\)/);
      if (srgb) {
        const parts = srgb[1].split(/[ /]+/).filter(Boolean).map(Number);
        return [parts[0] * 255, parts[1] * 255, parts[2] * 255, parts[3] === undefined ? 1 : parts[3]];
      }
      return null;
    };
    const over = (top: RGBA, below: RGBA): RGBA => {
      const alpha = top[3] + below[3] * (1 - top[3]);
      if (alpha === 0) return [0, 0, 0, 0];
      const mix = (a: number, b: number) => (a * top[3] + b * below[3] * (1 - top[3])) / alpha;
      return [mix(top[0], below[0]), mix(top[1], below[1]), mix(top[2], below[2]), alpha];
    };
    const channel = (value: number) => {
      const v = value / 255;
      return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    };
    const luminance = (c: RGBA) => 0.2126 * channel(c[0]) + 0.7152 * channel(c[1]) + 0.0722 * channel(c[2]);
    const label = (element: Element) => {
      const parts: string[] = [];
      let node: Element | null = element;
      for (let depth = 0; node && depth < 4; depth += 1, node = node.parentElement) {
        const cls = typeof node.className === 'string' ? node.className.trim().split(/\s+/).slice(0, 2).join('.') : '';
        parts.unshift(node.tagName.toLowerCase() + (node.id ? `#${node.id}` : '') + (cls ? `.${cls}` : ''));
      }
      return parts.join(' > ');
    };

    const failures: ContrastFailure[] = [];
    const seen = new Set<string>();
    const elements = Array.from(document.body.querySelectorAll('*'));

    for (const element of elements) {
      const hasText = Array.from(element.childNodes).some((node) => node.nodeType === 3 && (node.textContent || '').trim().length > 0);
      if (!hasText) continue;
      const style = getComputedStyle(element);
      if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) continue;
      const rect = element.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) continue;
      if (element.closest('[aria-hidden="true"], script, style, noscript, .sr-only, [hidden]')) continue;
      if (element.closest('.klaro')) continue; // third-party consent widget, checked separately

      let background: RGBA = [0, 0, 0, 0];
      let skip = false;
      for (let node: Element | null = element; node; node = node.parentElement) {
        const nodeStyle = getComputedStyle(node);
        if (nodeStyle.backgroundImage && nodeStyle.backgroundImage !== 'none' && !/^radial-gradient/.test(nodeStyle.backgroundImage) && node !== document.documentElement) {
          if (/url\(/.test(nodeStyle.backgroundImage) || /linear-gradient/.test(nodeStyle.backgroundImage)) {
            skip = true;
            break;
          }
        }
        const layer = parse(nodeStyle.backgroundColor);
        if (layer && layer[3] > 0) background = over(background, layer);
        if (background[3] >= 0.995) break;
        if (nodeStyle.filter && nodeStyle.filter !== 'none') { skip = true; break; }
      }
      if (skip) continue;
      if (background[3] < 0.995) background = over(background, parse(getComputedStyle(document.documentElement).backgroundColor) ?? [255, 255, 255, 1]);
      if (background[3] < 0.995) background = over(background, [255, 255, 255, 1]);

      const fgRaw = parse(style.color);
      if (!fgRaw) continue;
      const foreground = over(fgRaw, background);
      const l1 = luminance(foreground);
      const l2 = luminance(background);
      const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
      const size = parseFloat(style.fontSize);
      const bold = Number(style.fontWeight) >= 700;
      const large = size >= 24 || (bold && size >= 18.66);
      const required = large ? 3 : 4.5;
      if (ratio + 0.02 >= required) continue;

      const text = (element.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 60);
      const key = `${label(element)}|${text}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const fmt = (c: RGBA) => `rgb(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])})`;
      failures.push({ selector: label(element), text, ratio: Math.round(ratio * 100) / 100, required, fg: fmt(foreground), bg: fmt(background) });
    }
    return failures;
  });
}
