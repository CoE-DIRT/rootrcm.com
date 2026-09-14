// Ported from DIRT premium-react-site: src/components/sections/InteroperabilityLifecycle.jsx
// Statuses are relabeled Illustrative/Planned (never "ready"/live) per
// docs/final-merge/PUBLIC-SAFETY-EXCLUSIONS.md issue #3 — this is an illustrative
// export → review flow, not a working connector.
import { ArrowDown, ArrowRight, DatabaseZap, FileSymlink, ShieldCheck, Workflow } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { PipelineCard } from '@/components/ui/PipelineCard';
import type { StatusPillTone } from '@/components/ui/StatusPill';

const statusTone: Record<string, StatusPillTone> = {
  illustrative: 'illustrative',
  planned: 'planned',
};

const defaultStages = [
  { id: 'export', status: 'Illustrative', title: 'Practice system export', note: 'Operational export from existing EHR/PM systems — practice-owned, not a live connector.', contract: 'No live ingestion' },
  { id: 'normalize', status: 'Illustrative', title: 'Normalize & de-identify', note: 'Structure operational fields and remove identifiers before any review.', contract: 'No-PHI boundary' },
  { id: 'review', status: 'Planned', title: 'Human review', note: 'A reviewer validates findings before anything reaches an owner queue.', contract: 'Human-in-the-loop' },
  { id: 'action', status: 'Planned', title: 'Owned next action', note: 'Findings become an assigned, dated action — not an automated change.', contract: 'Reviewer-controlled' },
];

export interface InteroperabilityLifecycleProps {
  stages?: typeof defaultStages;
}

export function InteroperabilityLifecycle({ stages = defaultStages }: InteroperabilityLifecycleProps) {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <GlassCard variant="glass" accent="indigo" hover={false} className="h-full p-4">
          <div className="flex items-center gap-3">
            <DatabaseZap className="h-5 w-5 text-data-blue" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-text">Illustrative integration pattern</p>
              <p className="text-xs text-muted">Planned flow, not live ingestion</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard variant="glass" accent="cyan" hover={false} className="h-full p-4">
          <div className="flex items-center gap-3">
            <FileSymlink className="h-5 w-5 text-data-blue" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-text">Pipeline preview visibility</p>
              <p className="text-xs text-muted">Synthetic statuses for operator storytelling</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard variant="glass" accent="green" hover={false} className="h-full p-4">
          <div className="flex items-center gap-3">
            <Workflow className="h-5 w-5 text-recovery" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-text">Human review queue</p>
              <p className="text-xs text-muted">Every recommendation stays reviewer-controlled</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard variant="glass" accent="blush" hover={false} className="h-full p-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-signal-blush" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-text">No-PHI posture</p>
              <p className="text-xs text-muted">Readiness view only — no regulated payloads today</p>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="glass-surface p-5">
        {/* Horizontal pipeline at xl+, stacked vertical flow below — CSS breakpoint
            switch avoids a JS media-query hook on a client-only SPA (no SSR/hydration
            concern, but also no pre-JS layout flash this way). */}
        <div className="hidden overflow-x-auto pb-1 xl:block">
          <div className="flex min-w-[1120px] items-stretch gap-2">
            {stages.map((stage, index) => (
              <div key={stage.id} className="flex w-[220px] shrink-0 items-stretch gap-2">
                <PipelineCard
                  status={stage.status}
                  statusTone={statusTone[stage.status.toLowerCase()] ?? 'planned'}
                  title={stage.title}
                  note={stage.note}
                  contract={stage.contract}
                  accent={stage.status.toLowerCase() === 'illustrative' ? 'cyan' : 'indigo'}
                  className="flex-1"
                />
                {index < stages.length - 1 ? (
                  <ArrowRight className="h-5 w-5 shrink-0 self-center text-muted" aria-hidden="true" />
                ) : null}
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4 xl:hidden">
          {stages.map((stage, index) => (
            <div key={stage.id} className="space-y-3">
              <PipelineCard
                status={stage.status}
                statusTone={statusTone[stage.status.toLowerCase()] ?? 'planned'}
                title={stage.title}
                note={stage.note}
                contract={stage.contract}
                accent={stage.status.toLowerCase() === 'illustrative' ? 'cyan' : 'indigo'}
              />
              {index < stages.length - 1 ? <ArrowDown className="mx-auto h-5 w-5 text-muted" aria-hidden="true" /> : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
