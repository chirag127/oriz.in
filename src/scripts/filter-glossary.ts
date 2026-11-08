export function initGlossaryFilter(): void {
  const search = document.querySelector<HTMLInputElement>('#glossary-filter');
  const count = document.querySelector<HTMLElement>('#glossary-count');
  const empty = document.querySelector<HTMLElement>('#glossary-empty');
  const terms = Array.from(document.querySelectorAll<HTMLElement>('[data-glossary-term]'));
  const groups = Array.from(document.querySelectorAll<HTMLElement>('[data-glossary-group]'));
  if (!search || terms.length === 0) return;

  const update = () => {
    const tokens = search.value.trim().toLocaleLowerCase().split(/\s+/u).filter(Boolean);
    let visible = 0;
    for (const term of terms) {
      const haystack = term.dataset.glossarySearch ?? '';
      const show = tokens.every((token) => haystack.includes(token));
      term.hidden = !show;
      if (show) visible += 1;
    }
    for (const group of groups) {
      const children = group.querySelectorAll<HTMLElement>('[data-glossary-term]');
      group.hidden = !Array.from(children).some((term) => !term.hidden);
    }
    if (count) count.textContent = `${visible} of ${terms.length} terms`;
    if (empty) empty.hidden = visible !== 0;
  };

  search.addEventListener('input', update);
  update();
}
