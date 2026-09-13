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
    stage: 'Financial significance',
    title: 'Revenue intelligence',
    copy: 'Leakage, preventability, payer risk, recoverability, and workflow constraint become financially legible.',
    icon: CircleDollarSign,
    tone: 'significance',
  },
  {
    stage: 'Owner',
    title: 'Named accountability',
    copy: 'Each ranked item carries a clear owner so leadership can see who moves the work next.',
    icon: UserRound,
    tone: 'owner',
  },
  {
    stage: 'Next action',
    title: 'Prioritized action',
    copy: 'Evidence, next step, review cadence, and a management decision stay attached to the same record.',
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
    <ol className="dirtPipelineFlow" aria-label="DIRT signal to next action hierarchy">
      {evidenceChain.map((item, index) => {
        const Icon = item.icon;
        return (
          <li className={`dirtFlowCard tone-${item.tone}`} key={item.stage}>
            <div className="dirtFlowMeta">
              <Icon size={20} aria-hidden="true" />
              <span>{String(index + 1).padStart(2, '0')}</span>
            </div>
            <h3>{item.stage}</h3>
            <p>{item.copy}</p>
          </li>
        );
      })}
    </ol>
  );
}

function CommandRecord({ row }) {
  return (
    <article className="dirtCommandRecord">
      <h3>{row.signal}</h3>
      <dl>
        <div>
          <dt>Finding</dt>
          <dd>{row.finding}</dd>
        </div>
        <div>
          <dt>Financial significance</dt>
          <dd className="significance">{row.significance}</dd>
        </div>
        <div>
          <dt>Owner</dt>
          <dd>{row.owner}</dd>
        </div>
        <div>
          <dt>Next action</dt>
          <dd className="action">{row.action}</dd>
        </div>
      </dl>
    </article>
  );
}

export function DirtCommandVisual({ compact = false, rows = commandRows }) {
  const visibleRows = compact ? rows.slice(0, 1) : rows;

  return (
    <div className={`dirtCommandCenter glassCard${compact ? ' dirtCommandCompact' : ''}`} aria-label="DIRT revenue command center illustration">
      <div className="dirtCommandIntro">
        <span className="dirtStatus"><Activity size={14} aria-hidden="true" /> Illustrative operating signal</span>
        <strong>{compact ? 'Representative command record' : 'What leadership needs to act'}</strong>
        <p>Signal → finding → financial significance → owner → next action. Synthetic demonstration only.</p>
      </div>

      {!compact && (
        <div className="dirtCommandTableWrap">
          <table className="dirtCommandTable">
            <caption>Synthetic DIRT command examples. Not client results.</caption>
            <colgroup>
              <col className="signal" />
              <col className="finding" />
              <col className="significance" />
              <col className="owner" />
              <col className="action" />
            </colgroup>
            <thead>
              <tr>
                <th scope="col">Signal</th>
                <th scope="col">Finding</th>
                <th scope="col">Financial significance</th>
                <th scope="col">Owner</th>
                <th scope="col">Next action</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row) => (
                <tr key={row.signal}>
                  <th scope="row" className="signalCell">{row.signal}</th>
                  <td>{row.finding}</td>
                  <td className="significanceCell">{row.significance}</td>
                  <td className="ownerCell">{row.owner}</td>
                  <td className="actionCell">{row.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className={`dirtCommandRecords${compact ? ' is-compact' : ''}`}>
        {visibleRows.map((row) => <CommandRecord row={row} key={row.signal} />)}
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
    <div className="dirtCapabilityMatrix" role="list">
      {items.map(([title, copy], index) => (
        <article key={title} role="listitem">
          <span>{String(index + 1).padStart(2, '0')}</span>
          <div>
            <h3>{title}</h3>
            <p>{copy}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
