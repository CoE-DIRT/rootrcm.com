// Ported from DIRT premium-react-site: src/components/sections/ContinuousImprovementLoop.jsx
import { GlassCard } from '@/components/ui/GlassCard';

const defaultCards = [
  { title: 'Detect', text: 'Spot payer friction, denial clusters, A/R aging, and workflow leakage before they compound.', accent: 'amber' as const },
  { title: 'Explain', text: 'Translate raw operational noise into leadership-ready reasons, patterns, and risk signals.', accent: 'indigo' as const },
  { title: 'Prioritize', text: 'Rank issues by recoverability, urgency, and human-review need.', accent: 'cyan' as const },
  { title: 'Improve', text: 'Turn each review cycle into a smarter operating loop for the practice.', accent: 'green' as const },
  { title: 'Govern', text: 'Keep recommendations human-reviewed and no-PHI safe at every stage.', accent: 'indigo' as const },
];

export interface ContinuousImprovementLoopProps {
  label?: string;
  cards?: typeof defaultCards;
}

export function ContinuousImprovementLoop({
  label = 'Signal → Explain → Prioritize → Improve → Govern',
  cards = defaultCards,
}: ContinuousImprovementLoopProps) {
  return (
    <div className="space-y-5">
      <div className="rounded-[var(--radius-root)] border border-border bg-panel/55 px-4 py-3 text-sm text-muted">{label}</div>
      <div className="relative">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-3 right-3 top-1/2 hidden h-px -translate-y-1/2 bg-gradient-to-r from-data-blue/50 via-recovery/50 to-data-blue/50 xl:block"
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {cards.map((card, index) => (
            <GlassCard key={card.title} variant="glass" accent={card.accent} className="h-full">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-data-blue">Step {index + 1}</p>
              <h3 className="mt-1 text-base font-semibold text-text">{card.title}</h3>
              <p className="mt-2 text-sm text-muted">{card.text}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}
