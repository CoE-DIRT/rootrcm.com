import { MessageCircle, Phone, Mail } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { outreachChannels } from '../../siteData.js';

const icons: Record<string, typeof MessageCircle> = {
  whatsapp: MessageCircle,
  phone: Phone,
  email: Mail,
};

interface OutreachChannel {
  label: string;
  href?: string;
  status: string;
  cta: string;
  engagementType: string;
}

export function TalkToUs() {
  const live = (outreachChannels as OutreachChannel[]).filter((channel) => channel.status === 'Live' && channel.href);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="primary" size="md" data-cta="talk-to-us-open" data-location="talk-to-us">
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          Talk to us
        </Button>
      </DialogTrigger>
      <DialogContent title="Talk to ROOT" description="Reach us directly — no PHI or patient identifiers in your message.">
        <div className="flex flex-col gap-3">
          {live.map((channel) => {
            const Icon = icons[channel.engagementType] ?? MessageCircle;
            return (
              <a
                key={channel.label}
                href={channel.href}
                target={channel.href?.startsWith('http') ? '_blank' : undefined}
                rel={channel.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                data-cta={channel.cta}
                data-location="talk-to-us-dialog"
                data-engagement-type={channel.engagementType}
                className="flex items-center gap-3 rounded-[var(--radius-root)] border border-border p-3 text-sm text-text hover:border-accent"
              >
                <Icon className="h-4 w-4 text-accent" aria-hidden="true" />
                {channel.label}
              </a>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
