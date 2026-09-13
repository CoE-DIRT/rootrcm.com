import { Activity, CircleDollarSign, ListChecks, SearchCheck, UserRound } from 'lucide-react';

const evidenceChain = [
  {
    stage: 'Signal',
    title: 'Raw exports',
    copy: 'Aging, denials, posting, credentialing, queue, payer, and workflow reports enter as operational source material.',
    icon: Activity,
    tone: 'signal',
  },
  {
    stage: 'Finding',
    title: 'Validated signals',
    copy: 'Field lineage, reconciliation checks, and recurring patterns separate usable evidence from noise.',
    icon: SearchCheck,
    tone: 'finding',
  },
  {
    stage: 'Significance',
    title: 'Revenue intelligence',
    copy: 'Leakage, preventability, payer risk, recoverability, and workflow constraint become financially legible.',
    icon: CircleDollarSign,
    tone: 'significance',
  },
  {
    stage: 'Action',
    title: 'Prioritized action',
    copy: 'Ranked queue with owner, evidence, next step, review cadence, and a management decision.',
    icon: ListChecks,
    tone: 'action',
  },
];

const commandRows = [
  {
    signal: 'Aging landscape',
    finding: 'Concentration over 90 days',
    significance: 'Highest recoverable exposure',
    owner: 'A/R lead',
    action: 'Work by recoverability, not age alone',
  },
  {
    signal: 'Denial intelligence',
    finding: 'Recurring authorization cluster',
    significance: 'Preventable cash delay',
    owner: 'Denial lead',
    action: 'Fix front-end pattern + appeal queue',
  },
  {
    signal: 'Recovery priority',
    finding: 'High-value commercial backlog',
    significance: 'Cash timing risk',
    owner: 'RCM manager',
    action: 'Escalate payer follow-up this week',
  },
  {
    signal: 'PracticeOps signals',
    finding: 'Queue imbalance / handoff lag',
    significance: 'Operating constraint',
    owner: 'Ops lead',
    action: 'Reset ownership and review cadence',
  },
];

export function DirtPipelineFlow() {
  return (
    <div className="dirtPipelineFlow" aria-label="DIRT signal to action hierarchy">
      {evidenceChain.map((item, index) => {
        const Icon = item.icon;
        return (
          <article className={`dirtFlowCard tone-${item.tone}`} key={item.stage}>
            <div className="dirtFlowMeta">
              <Icon size={20} />
              <span>{String(index + 1).padStart(2, '0')}</span>
            </div>
            <p className="eyebrow">{item.stage}</p>
            <h3>{item.title}</h3>
            <p>{item.copy}</p>
          </article>
        );
      })}
    </div>
  );
}

export function DirtCommandVisual() {
  return (
    <div className="dirtCommandCenter glassCard" aria-label="DIRT revenue command center illustration">
      <div className="dirtCommandIntro">
        <span className="dirtStatus"><Activity size={14} /> Illustrative operating signal</span>
        <strong>Executive revenue command view</strong>
        <p>Signal → finding → financial significance → owner → next action. Synthetic demonstration only.</p>
      </div>
      <div className="dirtCommandTable" role="table" aria-label="Illustrative DIRT evidence rows">
        <div className="dirtCommandHead" role="row">
          <span role="columnheader">Signal</span>
          <span role="columnheader">Finding</span>
          <span role="columnheader">Significance</span>
          <span role="columnheader">Owner</span>
          <span role="columnheader">Next action</span>
        </div>
        {commandRows.map((row) => (
          <div className="dirtCommandRow" role="row" key={row.signal}>
            <span role="cell"><b>{row.signal}</b></span>
            <span role="cell">{row.finding}</span>
            <span role="cell"><em>{row.significance}</em></span>
            <span role="cell"><UserRound size={14} /> {row.owner}</span>
            <span role="cell">{row.action}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DirtCapabilityMatrix() {
  const items = [
    ['Revenue leakage detection', 'Where earned revenue disappears across workflow and payer behavior.'],
    ['Aging landscape', 'Value, age, payer, and status read as one recovery map.'],
    ['Denial intelligence', 'Pattern, preventability, and recovery path in one view.'],
    ['Recovery prioritization', 'Highest-impact work sequenced by recoverability and owner.'],
    ['PracticeOps signals', 'Queue friction and handoff failure made visible to leadership.'],
    ['Leadership command view', 'Evidence packaged for decision, cadence, and escalation.'],
  ];

  return (
    <div className="dirtCapabilityMatrix">
      {items.map(([title, copy], index) => (
        <article key={title}>
          <span>{String(index + 1).padStart(2, '0')}</span>
          <h3>{title}</h3>
          <p>{copy}</p>
        </article>
      ))}
    </div>
  );
}
