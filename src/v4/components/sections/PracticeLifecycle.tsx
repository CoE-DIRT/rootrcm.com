// Ported from DIRT premium-react-site: src/components/sections/PracticeLifecycle.jsx
import { ArrowRight } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

const defaultSteps = [
  'Credentialing & payer enrollment',
  'Onboarding & workflow setup',
  'Billing & claims submission',
  'A/R follow-up & denial recovery',
  'Reporting & operating visibility',
  'Growth & expansion planning',
];

const defaultSegments = ['Independent practices', 'Small multi-location groups', 'Specialty & ancillary practices'];

export interface PracticeLifecycleProps {
  steps?: string[];
  segments?: string[];
}

export function PracticeLifecycle({ steps = defaultSteps, segments = defaultSegments }: PracticeLifecycleProps) {
  return (
    <div className="space-y-6">
      <p className="max-w-3xl text-sm text-muted md:text-base">
        A practice is not just opened. It is credentialed, billed, collected, reported on, and grown — ROOT owns the
        business-side stages while clinical care stays with the practice.
      </p>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {steps.map((step, index) => (
          <GlassCard key={step} variant="lifecycle" accent="cyan" className="h-full">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-data-blue">Stage {index + 1}</p>
                <h3 className="mt-1 text-sm font-semibold text-text md:text-base">{step}</h3>
              </div>
              {index < steps.length - 1 ? <ArrowRight className="mt-1 h-4 w-4 text-muted" aria-hidden="true" /> : null}
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {segments.map((segment) => (
          <span key={segment} className="rounded-full border border-border bg-panel/70 px-3 py-1 text-xs font-medium text-muted">
            {segment}
          </span>
        ))}
      </div>
    </div>
  );
}
