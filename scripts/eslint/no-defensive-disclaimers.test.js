import { RuleTester } from 'eslint';
import parser from '@typescript-eslint/parser';
import { describe, it } from 'vitest';
import rule from './no-defensive-disclaimers.mjs';

RuleTester.describe = describe;
RuleTester.it = it;
const tester = new RuleTester({ languageOptions: { parser, parserOptions: { ecmaFeatures: { jsx: true } } } });
tester.run('no-defensive-disclaimers', rule, {
  valid: [
    'import { HeroMockup } from "./HeroMockup"; const card = <HeroMockup className="hero-mockup" />;',
    '// Editorial stock asset provenance.\nconst title = "Revenue intelligence";',
    'const privacy = <p>Do not submit patient information. Sample analysis.</p>;',
  ],
  invalid: [
    ...['editorial operations', 'not a client claim', 'synthetic demo', 'illustrative purposes', 'not actual patient', 'editorial stock', 'mockup', 'placeholder data', 'placeholder image', 'fictional', 'for demonstration'].map(text => ({
      code: `const card = <p>${text.toUpperCase()}</p>;`, errors: [{ messageId: 'disclaimer' }],
    })),
    { code: 'const card = <div aria-label="Synthetic demo" />;', errors: [{ messageId: 'disclaimer' }] },
    { code: 'const copy = { caption: "Editorial stock photo" };', errors: [{ messageId: 'disclaimer' }] },
    { code: 'const copy = `For demonstration only`;', errors: [{ messageId: 'disclaimer' }] },
    { code: 'const copy = `For demonstration: ${version}`;', errors: [{ messageId: 'disclaimer' }] },
    { code: 'const copy = `synthetic ${"demo"}`;', errors: [{ messageId: 'disclaimer' }] },
    { code: 'const copy = "not a " + "client claim";', errors: [{ messageId: 'disclaimer' }] },
    { code: 'const card = <p>illustrative\n purposes</p>;', errors: [{ messageId: 'disclaimer' }] },
  ],
});
