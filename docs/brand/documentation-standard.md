# ROOT documentation brand standard

Approved by the Founder on 26 October 2026. Applies to company-authored Google Docs, Word files, proposals, policies, operating reports and repository documentation.

## Identity

ROOT — Revenue Operations & Outcomes Technology Incorporated. DIRT means Data Intelligence for Revenue Transformation and is an embedded ROOT capability. Use company voice: we and our. Contact: info@rootrcm.com.

The approved master is `root-logo.png`. Preserve its aspect ratio, transparency and colors; never stretch, recolor or substitute a generated mark. Use meaningful alternative text: ROOT company logo. Keep clear space at least one quarter of the mark width. Use a compact logo in document headers or the first-page brand block; do not watermark body text.

## Approved interface tokens

| Role | Light | Dark |
|---|---|---|
| Background | #F4F7FB | #060D1A |
| Glass surface | rgba(255,255,255,0.6) | rgba(1,26,61,0.4) |
| Glass border | rgba(255,255,255,0.8) | rgba(0,240,255,0.15) |
| Primary text | #011A3D | #FFFFFF |
| Secondary text | rgba(1,26,61,0.6) | rgba(255,255,255,0.6) |
| Action accent | #0066FF | #00F0FF |

Web backgrounds may use the specified blue and cyan structural meshes. Dark mode may use navy and cyan background orbs and a soft cyan action glow. Validate actual composited contrast. Transparency values are design tokens, not evidence of accessible contrast.

## Documents and print adaptation

Use white paper or #F4F7FB panels, navy text, electric-blue heading accents and cyan header dividers. Tables use navy header cells with white text and white/pale-blue alternating rows. Cyan is decorative on light paper, not small body text. Do not simulate blur behind paragraphs. Use Trebuchet MS where reliably supported, Arial as the portable fallback. Body 10–11 pt, title 22 pt, section heading 13–16 pt. Existing legal form sizes and required layouts take precedence.

Use semantic headings, readable paragraphs, native tables and descriptive links. Preserve draft labels, approval status, signatures, field codes and legal language. Do not imply adoption, certification or approval through polish. Official filings, signed originals and vendor forms retain their original content and mandatory layouts; use a branded cover if appropriate.

Markdown uses a logo, semantic headings, tables, code fences and relative links. GitHub sanitizes arbitrary CSS: do not promise glass panels in rendered Markdown. HTML and exported digital reports may use `tokens.css`; provide a print stylesheet and readable fallback.

## Future documentation workflow

1. Start from `templates/ROOT_Document_Template.docx` or the Markdown template.
2. Record title, owner, version, date and approval status.
3. Apply the approved logo, colors, typography and page numbering.
4. Preserve the document identity, folder, permissions and meaning during updates.
5. Verify content, links, image rendering, table fit and pagination before release.
6. Log exceptions and update the brand audit register.

This standard is version-controlled guidance. It does not automatically intercept documents created outside the governed workflow.
