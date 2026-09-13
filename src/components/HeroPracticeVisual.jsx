import { motion, useReducedMotion } from 'motion/react';
import { mediaAssets } from '../siteData.js';

/**
 * Homepage hero media: contained practice-team photograph.
 * Editorial stock only — does not claim subjects are ROOT staff or clients.
 */
export default function HeroPracticeVisual() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="heroPracticeStage"
      aria-label="Practice team coordinating around a workstation"
      initial={reduceMotion ? false : { opacity: 0.85, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      <img
        className="heroPracticePhoto"
        src={mediaAssets.practiceTeamCollaboration}
        alt="Clinical team coordinating around a practice workstation. Editorial stock photograph; not ROOT staff or clients."
        width="940"
        height="627"
        decoding="async"
        fetchPriority="high"
      />
    </motion.div>
  );
}
