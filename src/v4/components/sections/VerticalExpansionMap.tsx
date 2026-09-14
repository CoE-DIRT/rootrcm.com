// Ported from DIRT premium-react-site: src/components/sections/VerticalExpansionMap.jsx
// DIRT's version links to speculative tenant/backend/roadmap routes (excluded per
// docs/final-merge/PUBLIC-SAFETY-EXCLUSIONS.md) — ROOT's expansion map links only to
// real, existing ROOT routes representing an actual engagement growth path.
import { GlassCard } from '@/components/ui/GlassCard';

const defaultNodes = [
  { label: 'Start with the Diagnostic', href: '/diagnostic/', note: '$2,500 fixed-fee opportunity register' },
  { label: 'Managed RCM execution', href: '/services/rcm/', note: 'ROOT owns billing, denials, A/R, and posting' },
  { label: 'DIRT intelligence layer', href: '/technology/dirt/', note: 'Prioritized signals connected to owners' },
  { label: 'Practice operations', href: '/services/practice-ops/', note: 'Operating cadence beyond revenue cycle' },
  { label: 'Credentialing & enrollment', href: '/services/credentialing/', note: 'Ongoing payer enrollment maintenance' },
  { label: 'Scaling multi-location practices', href: '/solutions/scaling-practice-ops/', note: 'Growth without operational drag' },
  { label: 'Full MSO partnership', href: '/pricing/', note: 'Custom-scoped, broader operating partnership' },
];

export interface VerticalExpansionMapProps {
  nodes?: typeof defaultNodes;
}

export function VerticalExpansionMap({ nodes = defaultNodes }: VerticalExpansionMapProps) {
  return (
    <div className="relative space-y-4">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-8 left-7 top-8 hidden w-px bg-gradient-to-b from-data-blue/40 via-intelligence/40 to-recovery/40 md:block"
      />
      <div className="grid gap-4 md:grid-cols-2">
        {nodes.map((node, index) => (
          <GlassCard key={node.label} variant="glass" accent={index % 2 === 0 ? 'cyan' : 'green'}>
            <div className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full border border-data-blue/40 bg-bg px-1 text-[11px] font-semibold text-data-blue">
                {index + 1}
              </span>
              <div>
                <a href={node.href} className="text-sm font-semibold text-text hover:text-data-blue">
                  {node.label}
                </a>
                <p className="mt-1 text-sm text-muted">{node.note}</p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
