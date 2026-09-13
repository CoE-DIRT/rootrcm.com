import { motion, useReducedMotion } from 'motion/react';
import { Activity } from 'lucide-react';
import { mediaAssets } from '../siteData.js';

/**
 * Homepage hero media: real practice-operations photography + one restrained
 * revenue-intelligence module. Does not claim stock subjects are ROOT staff.
 */
export default function HeroPracticeVisual() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="heroPracticeStage"
      aria-label="Practice operations photography with illustrative revenue intelligence overlay"
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <img
        className="heroPracticePhoto"
        src={mediaAssets.homePracticeOperations}
        alt="Medical office administrator reviewing a tablet in a calm practice setting. Editorial stock photograph; not a ROOT employee or customer."
        width="960"
        height="720"
        decoding="async"
        fetchPriority="high"
      />
      <div className="heroPhotoOverlay" aria-hidden="true" />
      <aside className="heroIntelligenceModule glassCard" aria-label="Illustrative revenue intelligence summary">
        <div className="heroIntelHeader">
          <span className="dirtStatus"><Activity size={14} /> Illustrative signal</span>
          <strong>Revenue intelligence layer</strong>
        </div>
        <ol className="heroIntelFlow">
          <li><b>Signal</b><small>Aging + denial concentration</small></li>
          <li><b>Finding</b><small>Preventable pattern cluster</small></li>
          <li><b>Significance</b><small>Value at risk prioritized</small></li>
          <li><b>Action</b><small>Owner · cadence · next step</small></li>
        </ol>
        <p className="heroIntelNote">Synthetic illustration. Not live telemetry or a client result.</p>
      </aside>
    </motion.div>
  );
}
