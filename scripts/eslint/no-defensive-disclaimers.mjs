// Scan copy, including content dictionaries and accessible names, without
// treating comments, imported component names or CSS hooks as visitor copy.
export const disclaimerPattern = /editorial operations|not a client claim|synthetic demo|illustrative purposes|not actual patient|editorial stock|mockup|placeholder (?:data|image)|fictional|for demonstration/i;

function staticText(node) {
  if (node.type === 'Literal' && typeof node.value === 'string') return node.value;
  if (node.type === 'JSXText') return node.value;
  if (node.type === 'TemplateElement') return node.value.cooked;
  if (node.type === 'TemplateLiteral') {
    const expressions = node.expressions.map(staticText);
    if (expressions.every(value => value !== undefined)) return node.quasis.map((part, i) => part.value.cooked + (expressions[i] || '')).join('');
  }
  if (node.type === 'BinaryExpression' && node.operator === '+') {
    const left = staticText(node.left), right = staticText(node.right);
    if (left !== undefined && right !== undefined) return left + right;
  }
}

export default {
  meta: {
    type: 'problem',
    schema: [],
    messages: { disclaimer: 'Remove defensive UI copy matching "{{match}}". Put useful context in surrounding copy; preserve necessary legal, consent and no-PHI language.' },
  },
  create(context) {
    function check(node) {
      let ancestor = node.parent;
      while (ancestor) {
        if (['ImportDeclaration', 'ExportNamedDeclaration', 'ExportAllDeclaration'].includes(ancestor.type) && ancestor.source === node) return;
        if (ancestor.type === 'JSXAttribute' && ['className', 'id'].includes(ancestor.name.name)) return;
        ancestor = ancestor.parent;
      }
      // Report a joined constant once, rather than each of its fragments.
      if (node.parent?.type === 'BinaryExpression' && staticText(node.parent) !== undefined) return;
      if (node.parent?.type === 'TemplateLiteral' && staticText(node.parent) !== undefined) return;
      const value = staticText(node);
      const match = value?.replace(/\s+/g, ' ').match(disclaimerPattern);
      if (match) context.report({ node, messageId: 'disclaimer', data: { match: match[0] } });
    }
    return { Literal: check, JSXText: check, TemplateLiteral: check, TemplateElement: check, BinaryExpression: check };
  },
};
