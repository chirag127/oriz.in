import { visit } from 'unist-util-visit';

function textOf(node) {
  if (!node) return '';
  if (node.type === 'text') return node.value;
  if (!Array.isArray(node.children)) return '';
  return node.children.map(textOf).join('');
}

function el(tagName, properties, children = []) {
  return { type: 'element', tagName, properties, children };
}

function text(value) {
  return { type: 'text', value };
}

/**
 * Turns fenced mermaid blocks into an accessible figure with a source
 * fallback, and wraps wide tables in a keyboard-focusable scroll region.
 */
export function rehypeContent() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (!parent || typeof index !== 'number') return;

      if (node.tagName === 'pre') {
        const code = node.children?.find((child) => child.tagName === 'code');
        const className = [node.properties?.className, code?.properties?.className]
          .flat()
          .filter(Boolean);
        const language =
          node.properties?.dataLanguage ??
          node.properties?.['data-language'] ??
          code?.properties?.dataLanguage;
        const isMermaid =
          language === 'mermaid' ||
          className.some((name) => String(name).includes('language-mermaid'));

        if (isMermaid) {
          const source = textOf(code ?? node).replace(/\n$/, '');
          const figure = el('figure', { className: ['diagram-figure'] }, [
            el(
              'div',
              {
                className: ['mermaid-diagram'],
                'data-mermaid': '',
                role: 'img',
                tabIndex: 0,
                'aria-label':
                  'Diagram. Scroll horizontally if needed. A text source alternative is available directly below.',
              },
              [el('p', { className: ['diagram-placeholder'] }, [
                text('This diagram is rendered in your browser. The source is available below.'),
              ])],
            ),
            el('figcaption', { className: ['diagram-caption'] }, [
              text('Rendered diagram; scroll horizontally if needed. The text source follows.'),
            ]),
            el('details', { className: ['diagram-source'] }, [
              el('summary', {}, [text('Diagram source')]),
              el('pre', { tabIndex: 0 }, [el('code', {}, [text(source)])]),
            ]),
          ]);

          parent.children[index] = figure;
          return;
        }
      }

      if (node.tagName === 'input' && node.properties?.type === 'checkbox') {
        const label = textOf(parent).replace(/\s+/g, ' ').trim().slice(0, 160);
        node.properties['aria-label'] = label || 'Checklist item';
      }

      if (node.tagName === 'table') {
        const caption = node.children?.find((child) => child.tagName === 'caption');
        const captionText = textOf(caption).trim();
        const label = captionText ? `Table: ${captionText}` : 'Scrollable table';
        parent.children[index] = el(
          'div',
          {
            className: ['table-wrap'],
            role: 'region',
            'aria-label': label,
            tabIndex: 0,
          },
          [node],
        );
      }
    });
  };
}
