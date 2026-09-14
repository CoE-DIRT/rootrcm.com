// Ported from DIRT premium-react-site: src/components/sections/WorkforceGrid.jsx
// DIRT's source lists specific executive job titles (VP of Revenue Strategy, Chief
// Trust Officer, ...) which would misrepresent named ROOT staff roles — excluded per
// docs/final-merge/PUBLIC-SAFETY-EXCLUSIONS.md ("responsibilities rather than staff
// claims"). This keeps the card-grid structure with ROOT's actual accountable
// responsibility areas instead of invented titles.
import { BarChart3, Briefcase, Building2, Wrench } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

const matrix = [
  {
    title: 'Revenue strategy',
    icon: Building2,
    accent: 'cyan' as const,
    items: ['Diagnostic scoping & findings review', 'Pricing & engagement structure', 'Payer strategy guidance', 'Growth-path sequencing'],
  },
  {
    title: 'Operating execution',
    icon: Briefcase,
    accent: 'indigo' as const,
    items: ['Billing & claims execution', 'Denial & A/R follow-up', 'Credentialing & enrollment upkeep', 'Practice operations cadence'],
  },
  {
    title: 'Analytics & reporting',
    icon: BarChart3,
    accent: 'green' as const,
    items: ['DIRT signal review', 'Leadership reporting cadence', 'A/R & denial pattern analysis', 'Opportunity register upkeep'],
  },
  {
    title: 'Technology & automation',
    icon: Wrench,
    accent: 'blush' as const,
    items: ['Workflow automation scoping', 'Healthcare IT support', 'Practice system alignment', 'DIRT product delivery'],
  },
];

export function WorkforceGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {matrix.map((column) => {
        const Icon = column.icon;
        return (
          <GlassCard key={column.title} variant="metric" accent={column.accent} className="h-full">
            <header className="mb-3 flex items-center gap-2">
              <Icon className="h-4 w-4 text-data-blue" aria-hidden="true" />
              <h3 className="text-sm font-semibold text-text">{column.title}</h3>
            </header>
            <ul className="space-y-2 text-sm text-muted">
              {column.items.map((item) => (
                <li key={item} className="rounded-md border border-border bg-bg-deep/60 px-3 py-2">
                  {item}
                </li>
              ))}
            </ul>
          </GlassCard>
        );
      })}
    </div>
  );
}
