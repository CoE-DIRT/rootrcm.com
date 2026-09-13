import { ShieldCheck, Lock, Building2, Phone } from 'lucide-react';
import { companyInfo } from '../../siteData.js';
import { trustRegistry } from '@/growth/trustRegistry';
import { cn } from '@/lib/cn';

const icons = {
  identity: Building2,
  contact: Phone,
  privacy: ShieldCheck,
  security: Lock,
} as const;

export function TrustSignals({ className }: { className?: string }) {
  return (
    <ul className={cn('grid gap-3 sm:grid-cols-2', className)} aria-label="Trust signals">
      {trustRegistry.map((item) => {
        const Icon = icons[item.kind] ?? ShieldCheck;
        return (
          <li key={item.id} className="flex gap-3 rounded-[var(--radius-root)] border border-border bg-panel/40 p-4">
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
            <div>
              <p className="text-sm font-medium text-text">{item.label}</p>
              <p className="mt-1 text-xs text-muted">{item.detail}</p>
            </div>
          </li>
        );
      })}
      <li className="flex gap-3 rounded-[var(--radius-root)] border border-border bg-panel/40 p-4 sm:col-span-2">
        <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
        <div>
          <p className="text-sm font-medium text-text">{companyInfo.legalName}</p>
          <p className="mt-1 text-xs text-muted">{companyInfo.addressLines.join(', ')}</p>
        </div>
      </li>
    </ul>
  );
}
