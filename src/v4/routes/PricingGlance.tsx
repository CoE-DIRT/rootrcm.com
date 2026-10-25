import { pricingModels } from '../../siteData.js';

type PricingModel = (typeof pricingModels)[number];

/** Variant of the pricing A/B test: the same published models in one comparison table. No new claims or numbers. */
export default function PricingGlance() {
  return (
    <div className="h-full min-h-[30rem] overflow-x-auto rounded-[var(--radius-root)] border border-border">
        <table className="w-full min-w-[40rem] border-collapse text-left text-sm" data-testid="pricing-glance">
          <caption className="sr-only">ROOT engagement models and their published pricing</caption>
          <thead>
            <tr className="border-b border-border bg-bg-soft text-xs uppercase tracking-[0.1em] text-muted">
              <th scope="col" className="px-4 py-3 font-semibold">
                Engagement
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Published pricing
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Best for
              </th>
            </tr>
          </thead>
          <tbody>
            {pricingModels.map((model: PricingModel) => (
              <tr key={model.name} className="border-b border-border last:border-b-0 align-top">
                <th scope="row" className="px-4 py-3 font-semibold text-text">
                  {model.name}
                </th>
                <td className="px-4 py-3 font-semibold text-text">{model.price}</td>
                <td className="px-4 py-3 text-muted">{model.bestFor}</td>
              </tr>
            ))}
          </tbody>
        </table>
    </div>
  );
}

