// Ported from DIRT premium-react-site: src/components/ui/AnnotationNote.jsx
import { cn } from '@/lib/cn';

export interface AnnotationNoteProps {
  label?: string;
  text: string;
  className?: string;
}

export function AnnotationNote({ label = 'Operational note', text, className }: AnnotationNoteProps) {
  return (
    <p
      className={cn(
        'rounded-[var(--radius-root)] border border-border-strong/70 bg-panel/78 px-3 py-2 text-xs font-medium text-muted shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]',
        className,
      )}
    >
      <span className="text-data-blue">{label}:</span> {text}
    </p>
  );
}
