// Ported from DIRT premium-react-site: src/components/sections/ImplementationSteps.jsx
// DIRT's source labels steps "Day 1 / Day 7 / Day 30" as delivery promises — excluded
// per docs/final-merge/PUBLIC-SAFETY-EXCLUSIONS.md ("not ROOT-approved commercial
// commitments"). This keeps only the connected-timeline visual structure; step
// content and count are supplied by the caller (ROOT's actual journey, no dates).
import { GlassCard } from '@/components/ui/GlassCard';

export interface ImplementationStep {
  title: string;
  copy: string;
  note?: string;
}

export function ImplementationSteps({ steps }: { steps: ImplementationStep[] }) {
  return (
    <div className="relative ml-2 border-l border-intelligence/40 pl-7">
      {steps.map((step, index) => (
        <div key={step.title} className="relative mb-4 last:mb-0">
          <span
            aria-hidden="true"
            className="absolute -left-[2.0rem] top-6 h-3 w-3 rounded-full bg-intelligence"
          />
          <GlassCard variant="glass" accent="indigo" hover={false} className="h-full">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-data-blue">
              Step {String(index + 1).padStart(2, '0')}
            </p>
            <h3 className="mt-1 text-lg font-semibold text-text">{step.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{step.copy}</p>
            {step.note ? <p className="mt-2 text-xs font-semibold text-data-blue">{step.note}</p> : null}
          </GlassCard>
        </div>
      ))}
    </div>
  );
}
