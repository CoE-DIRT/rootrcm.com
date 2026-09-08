import { ArrowRight, BarChart3, CheckCircle2, ClipboardList, FileText, Workflow } from 'lucide-react';
import { diagnosticSample, proofWorkAssets, syntheticPractice } from '../proofData.js';

function currency(value) {
  return `$${Math.round(value / 1000)}K`;
}

function getPercent(value, total) {
  return `${Math.round((value / total) * 100)}%`;
}

function ProofShell({ asset, children, className = '' }) {
  return (
    <div className={`proofShell glassCard ${className}`} aria-label={`${asset.title} preview`}>
      <div className="proofHeader">
        <span>{asset.label}</span>
        <strong>{syntheticPractice.name}</strong>
      </div>
      <div className="proofTitle">
        <p>{asset.capability}</p>
        <h3>{asset.title}</h3>
      </div>
      {children}
      <div className="proofAnswerGrid">
        <span><b>Seeing</b><small>{asset.seeing}</small></span>
        <span><b>Meaning</b><small>{asset.meaning}</small></span>
        <span><b>Action</b><small>{asset.action}</small></span>
      </div>
      <p className="proofInsight">{asset.insight}</p>
    </div>
  );
}

function RcmControlPreview({ asset }) {
  return (
    <ProofShell asset={asset}>
      <div className="metricStrip">
        {asset.metrics.map(([label, value]) => (
          <span key={label}>
            <small>{label}</small>
            <b>{value}</b>
          </span>
        ))}
      </div>
      <div className="workflowRail">
        {asset.workflow.map(([step, owner, state]) => (
          <div key={step}>
            <CheckCircle2 size={16} />
            <span>
              <b>{step}</b>
              <small>{owner}</small>
            </span>
            <em>{state}</em>
          </div>
        ))}
      </div>
    </ProofShell>
  );
}

function ArAnalysisPreview({ asset }) {
  const total = asset.buckets.reduce((sum, [, value]) => sum + value, 0);
  return (
    <ProofShell asset={asset}>
      <div className="arBars">
        {asset.buckets.map(([bucket, value]) => (
          <div key={bucket}>
            <span>{bucket}</span>
            <i style={{ '--width': getPercent(value, total) }} />
            <b>{currency(value)}</b>
          </div>
        ))}
      </div>
      <div className="proofTable compactTable">
        {asset.queue.map(([segment, amount, priority, action]) => (
          <div key={segment}>
            <span>{segment}</span>
            <b>{amount}</b>
            <em>{priority}</em>
            <small>{action}</small>
          </div>
        ))}
      </div>
    </ProofShell>
  );
}

function DenialParetoPreview({ asset }) {
  const totalCount = asset.categories.reduce((sum, [, count]) => sum + count, 0);
  const totalAmount = asset.categories.reduce((sum, [, , amount]) => sum + amount, 0);
  return (
    <ProofShell asset={asset}>
      <div className="paretoSummary">
        <span><small>Total denial events</small><b>{totalCount}</b></span>
        <span><small>Value at risk</small><b>{currency(totalAmount)}</b></span>
      </div>
      <div className="paretoList">
        {asset.categories.map(([category, count, amount, cause]) => (
          <div key={category}>
            <span>
              <b>{category}</b>
              <small>{cause}</small>
            </span>
            <i style={{ '--width': `${Math.round((count / totalCount) * 100)}%` }} />
            <em>{count} / {currency(amount)}</em>
          </div>
        ))}
      </div>
    </ProofShell>
  );
}

function CredentialingPreview({ asset }) {
  return (
    <ProofShell asset={asset}>
      <div className="proofTable credentialingTable">
        {asset.rows.map(([provider, payer, status, age, owner]) => (
          <div key={`${provider}-${payer}`}>
            <span>{provider}</span>
            <b>{payer}</b>
            <em>{status}</em>
            <small>{age} | {owner}</small>
          </div>
        ))}
      </div>
    </ProofShell>
  );
}

function PracticeOpsPreview({ asset }) {
  return (
    <ProofShell asset={asset}>
      <div className="metricStrip">
        {asset.metrics.map(([label, value]) => (
          <span key={label}>
            <small>{label}</small>
            <b>{value}</b>
          </span>
        ))}
      </div>
      <div className="priorityMatrix">
        {asset.matrix.map(([axis, action]) => (
          <span key={axis}>
            <small>{axis}</small>
            <b>{action}</b>
          </span>
        ))}
      </div>
    </ProofShell>
  );
}

function DirtCommandPreview({ asset }) {
  return (
    <ProofShell asset={asset} className="dirtProof">
      <div className="signalBoard">
        {asset.signals.map(([signal, value, action], index) => (
          <div key={signal} style={{ '--signal': `${70 - index * 9}%` }}>
            <BarChart3 size={17} />
            <span>
              <b>{signal}</b>
              <small>{value}</small>
            </span>
            <em>{action}</em>
          </div>
        ))}
      </div>
    </ProofShell>
  );
}

export function ProofAsset({ assetKey }) {
  const asset = proofWorkAssets[assetKey] || proofWorkAssets.rcmControl;
  const views = {
    rcmControl: <RcmControlPreview asset={asset} />,
    arAnalysis: <ArAnalysisPreview asset={asset} />,
    denialPareto: <DenialParetoPreview asset={asset} />,
    credentialingTracker: <CredentialingPreview asset={asset} />,
    practiceOpsScorecard: <PracticeOpsPreview asset={asset} />,
    dirtCommand: <DirtCommandPreview asset={asset} />,
  };

  return views[assetKey] || views.rcmControl;
}

export function ProofLibrarySection() {
  return (
    <section className="contentSection proofLibrary" data-reveal>
      <div className="sectionHeading">
        <p className="eyebrow">See how ROOT works</p>
        <h2>Proof of work, rebuilt as public-safe demonstrations.</h2>
        <p>These previews use a fictional practice and reconciled synthetic data to show ROOT-style analysis, workflow logic, deliverable structure, and DIRT intelligence without presenting client results or exposing PHI.</p>
      </div>
      <div className="proofFeatureGrid">
        <ProofAsset assetKey="arAnalysis" />
        <ProofAsset assetKey="denialPareto" />
      </div>
    </section>
  );
}

export function CapabilityProofSection({ assetKey, heading = 'Representative work product', copy }) {
  return (
    <section className="splitSection proofPlacement" data-reveal>
      <div>
        <p className="eyebrow">Synthetic proof of work</p>
        <h2>{heading}</h2>
        <p>{copy || 'A public-safe demonstration based on verified healthcare revenue-cycle operating patterns, rebuilt with fictional practice data and explicit synthetic labeling.'}</p>
        <p className="syntheticNote">No patient, claim, provider NPI, payer contract, client, facility, or production-system identifier is used in this preview.</p>
      </div>
      <ProofAsset assetKey={assetKey} />
    </section>
  );
}

export function DiagnosticSampleSection() {
  return (
    <section className="contentSection diagnosticSample" data-reveal>
      <div className="sectionHeading">
        <p className="eyebrow">Sample analytical output</p>
        <h2>{diagnosticSample.title}</h2>
        <p>A realistic preview of the Diagnostic package structure using Willowbend Physician Group, a fictional five-provider practice. The numbers reconcile to the same demonstration universe used throughout the site.</p>
      </div>
      <div className="diagnosticPages">
        {diagnosticSample.pages.map(([title, copy], index) => (
          <article className="glassCard" key={title}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <FileText size={22} />
            <h3>{title}</h3>
            <p>{copy}</p>
          </article>
        ))}
      </div>
      <div className="diagnosticProofRow">
        <ProofAsset assetKey="dirtCommand" />
        <div className="roadmapPreview glassCard">
          <span>Illustrative 30/60/90 roadmap</span>
          {['Stabilize claim work queues and owner cadence', 'Correct preventable denial sources and payer escalations', 'Install KPI review rhythm and DIRT monitoring'].map((item, index) => (
            <div key={item}>
              <b>{index === 0 ? '30' : index === 1 ? '60' : '90'} days</b>
              <p>{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DirtDemonstrationSection() {
  return (
    <section className="contentSection dirtDemo" data-reveal>
      <div className="sectionHeading">
        <p className="eyebrow">DIRT demonstration</p>
        <h2>Raw signals become prioritized management intelligence.</h2>
        <p>The same fictional practice data moves from source-style facts into revenue leakage, A/R concentration, denial concentration, payer risk, workflow priority, and unresolved revenue queues.</p>
      </div>
      <div className="dirtDemoGrid">
        <ProofAsset assetKey="dirtCommand" />
        <div className="intelligenceFlow glassCard">
          {[
            ['Verified source pattern', 'Report family, field lineage, metric definition, QA rule'],
            ['Synthetic reconstruction', 'Fictional practice, surrogate identifiers, reconciled dollars'],
            ['Management output', 'Ranked queue, owner, reason, deadline, decision priority'],
          ].map(([title, copy]) => (
            <div key={title}>
              <Workflow size={18} />
              <span>
                <b>{title}</b>
                <small>{copy}</small>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ResourceProofCallout({ assetKey }) {
  const asset = proofWorkAssets[assetKey] || proofWorkAssets.rcmControl;
  return (
    <section className="resourceProof glassCard">
      <ClipboardList size={21} />
      <span>
        <b>Example output: {asset.title}</b>
        <small>{asset.label}. Built from fictional practice data to show the operating method, not a client result.</small>
      </span>
      <a href="/diagnostic/">Apply this through the Diagnostic <ArrowRight size={14} /></a>
    </section>
  );
}
