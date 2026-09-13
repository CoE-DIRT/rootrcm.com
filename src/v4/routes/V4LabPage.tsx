import { useState } from 'react';
import { Button, LinkButton, IconButton } from '@/components/ui/Button';
import { Input, Textarea, FormField } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import { Section, SectionHeader, CTAGroup } from '@/components/ui/Section';
import { Callout, EmptyState, ErrorState } from '@/components/ui/Callout';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Accordion, AccordionItem } from '@/components/ui/Accordion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/Dialog';
import { TooltipProvider, Tooltip } from '@/components/ui/Tooltip';
import { MarketingHeader } from '@/components/MarketingHeader';
import { MarketingFooter } from '@/components/MarketingFooter';
import { TalkToUs } from '@/components/TalkToUs';
import { FollowRoot } from '@/components/FollowRoot';
import { X } from 'lucide-react';

/**
 * Dev-only component gallery. Excluded from production build (see vite.config.js
 * excludedFromProduction set) and served with a noindex meta tag. Renders every
 * V4 primitive and major component built so far, plus a state matrix (default,
 * disabled, mobile/desktop via resizing) so Cursor can inspect everything without
 * hunting through routes.
 */
export function V4LabPage() {
  const [checked, setChecked] = useState(false);

  return (
    <TooltipProvider>
      <div className="v4-root min-h-screen bg-bg text-text">
        <MarketingHeader />
        <main id="main-content" className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <Callout tone="warning" title="Development only" className="mb-10">
            This route is excluded from the production build and marked noindex.
          </Callout>

          <Section className="!py-0">
            <SectionHeader eyebrow="Lab" title="V4 component gallery" />
          </Section>

          <LabGroup title="Buttons">
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="primary" disabled>
                Disabled
              </Button>
              <LinkButton href="#" variant="primary" size="sm">
                Link button
              </LinkButton>
              <IconButton label="Close example">
                <X className="h-4 w-4" />
              </IconButton>
            </div>
          </LabGroup>

          <LabGroup title="Form fields">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Practice name" htmlFor="lab-name" required>
                <Input id="lab-name" placeholder="Willowbend Physician Group" />
              </FormField>
              <FormField label="With error" htmlFor="lab-error" error="This field is required.">
                <Input id="lab-error" aria-invalid="true" />
              </FormField>
              <FormField label="Message" htmlFor="lab-message" hint="No PHI or patient identifiers.">
                <Textarea id="lab-message" rows={3} />
              </FormField>
              <div className="flex items-center">
                <Checkbox
                  id="lab-checkbox"
                  label="I acknowledge no PHI is included"
                  checked={checked}
                  onCheckedChange={(value: boolean) => setChecked(value)}
                />
              </div>
            </div>
          </LabGroup>

          <LabGroup title="Feedback states">
            <div className="grid gap-4 sm:grid-cols-2">
              <EmptyState title="No signals yet" description="Connect a data source to see findings here." />
              <ErrorState title="Could not load data" description="Retry, or contact support if this persists." />
            </div>
          </LabGroup>

          <LabGroup title="Accordion">
            <Accordion type="single" collapsible className="max-w-xl">
              <AccordionItem value="a" trigger="What is the Diagnostic?">
                A fixed-fee, $2,500 revenue optimization review with a 90-day action plan.
              </AccordionItem>
              <AccordionItem value="b" trigger="Is any PHI collected?">
                No. All intake is deidentified operational data.
              </AccordionItem>
            </Accordion>
          </LabGroup>

          <LabGroup title="Tabs">
            <Tabs defaultValue="one" className="max-w-md">
              <TabsList>
                <TabsTrigger value="one">Overview</TabsTrigger>
                <TabsTrigger value="two">Details</TabsTrigger>
              </TabsList>
              <TabsContent value="one" className="pt-4 text-sm text-muted">
                Overview content.
              </TabsContent>
              <TabsContent value="two" className="pt-4 text-sm text-muted">
                Detail content.
              </TabsContent>
            </Tabs>
          </LabGroup>

          <LabGroup title="Dialog & Tooltip">
            <div className="flex items-center gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="secondary">Open dialog</Button>
                </DialogTrigger>
                <DialogContent title="Example dialog" description="Used for TalkToUs and confirmations.">
                  <p className="text-sm text-muted">Dialog body content.</p>
                </DialogContent>
              </Dialog>
              <Tooltip label="Tooltip content">
                <Button variant="ghost">Hover me</Button>
              </Tooltip>
            </div>
          </LabGroup>

          <LabGroup title="Breadcrumb">
            <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Services', href: '/services/' }, { label: 'Credentialing' }]} />
          </LabGroup>

          <LabGroup title="Major components">
            <div className="flex flex-wrap items-center gap-4">
              <TalkToUs />
              <FollowRoot />
            </div>
          </LabGroup>

          <LabGroup title="CTAGroup">
            <CTAGroup>
              <Button variant="primary">Primary action</Button>
              <Button variant="outline">Secondary action</Button>
            </CTAGroup>
          </LabGroup>
        </main>
        <MarketingFooter />
      </div>
    </TooltipProvider>
  );
}

function LabGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-12 border-t border-border pt-8">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-accent">{title}</h2>
      {children}
    </section>
  );
}
