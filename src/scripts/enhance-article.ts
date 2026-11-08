type MermaidApi = typeof import('mermaid')['default'];
type PurifyApi = typeof import('dompurify')['default'];

let mermaidPromise: Promise<MermaidApi> | null = null;
let purifyPromise: Promise<PurifyApi> | null = null;

function loadMermaid(): Promise<MermaidApi> {
  if (!mermaidPromise) {
    mermaidPromise = import('mermaid').then((module) => module.default);
  }
  return mermaidPromise;
}

function loadPurify(): Promise<PurifyApi> {
  if (!purifyPromise) {
    purifyPromise = import('dompurify').then((module) => module.default);
  }
  return purifyPromise;
}

function currentTheme(): 'dark' | 'light' {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

function fitDiagram(svg: SVGSVGElement): void {
  const box = svg.getBBox();
  if (box.width <= 0 || box.height <= 0) return;
  const padding = 8;
  svg.setAttribute(
    'viewBox',
    `${box.x - padding} ${box.y - padding} ${box.width + padding * 2} ${box.height + padding * 2}`,
  );

  const wrapper = svg.closest<HTMLElement>('.mermaid-diagram');
  if (!wrapper) return;
  const style = window.getComputedStyle(wrapper);
  const available =
    wrapper.clientWidth -
    Number.parseFloat(style.paddingLeft || '0') -
    Number.parseFloat(style.paddingRight || '0');
  const naturalWidth = box.width + padding * 2;
  svg.style.maxWidth = available > 0 && naturalWidth <= available * 1.3 ? '100%' : 'none';
}

function resizeDiagrams(): void {
  document.querySelectorAll<SVGSVGElement>('.mermaid-diagram svg').forEach(fitDiagram);
}

let resizeTimer: number | undefined;

function scheduleDiagramResize(): void {
  window.clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(resizeDiagrams, 150);
}

async function renderDiagrams(): Promise<void> {
  const diagrams = Array.from(
    document.querySelectorAll<HTMLElement>('.mermaid-diagram[data-mermaid]'),
  );
  if (diagrams.length === 0) return;

  const [mermaid, DOMPurify] = await Promise.all([
    loadMermaid(),
    loadPurify(),
  ]);

  const theme = currentTheme();
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'strict',
    theme: theme === 'dark' ? 'dark' : 'neutral',
    fontFamily: '"Times New Roman", Times, serif',
    htmlLabels: false,
    flowchart: { htmlLabels: false, useMaxWidth: false },
    sequence: { useMaxWidth: false },
    state: { useMaxWidth: false },
    er: { useMaxWidth: false },
  });

  for (const [index, diagram] of diagrams.entries()) {
    const figure = diagram.closest('figure');
    const source = figure?.querySelector('.diagram-source code')?.textContent ?? '';
    if (!source.trim()) {
      diagram.textContent = 'Diagram source is unavailable.';
      continue;
    }
    try {
      const result = await mermaid.render(
        `oriz-mermaid-${index}-${Date.now()}`,
        source,
      );
      diagram.innerHTML = DOMPurify.sanitize(result.svg, {
        USE_PROFILES: { svg: true, svgFilters: true },
      });
      const svg = diagram.querySelector('svg');
      if (svg) fitDiagram(svg);
      diagram.classList.remove('is-error');
      diagram.removeAttribute('aria-busy');
    } catch {
      diagram.classList.add('is-error');
      diagram.textContent =
        'This diagram could not be rendered in your browser. The source is available below.';
    }
  }
}

function addCodeCopyButtons(): void {
  const blocks = document.querySelectorAll<HTMLPreElement>('.prose pre');
  for (const block of blocks) {
    if (block.querySelector('.code-copy')) continue;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'code-copy';
    button.textContent = 'Copy';
    button.setAttribute('aria-label', 'Copy code block');
    button.addEventListener('click', async () => {
      const code = block.querySelector('code')?.textContent ?? block.textContent ?? '';
      try {
        await navigator.clipboard.writeText(code);
        button.textContent = 'Copied';
      } catch {
        button.textContent = 'Copy failed';
      }
      window.setTimeout(() => {
        button.textContent = 'Copy';
      }, 2200);
    });
    block.append(button);
  }
}

export function enhanceArticles(): void {
  addCodeCopyButtons();

  if (document.querySelector('.mermaid-diagram[data-mermaid]')) {
    renderDiagrams().catch(() => {
      document.querySelectorAll<HTMLElement>('.mermaid-diagram').forEach((diagram) => {
        diagram.textContent =
          'This diagram could not be rendered. The source is available below.';
      });
    });

    window.addEventListener('oriz:themechange', () => {
      renderDiagrams().catch(() => undefined);
    });

    window.addEventListener('resize', scheduleDiagramResize, { passive: true });
  }
}
