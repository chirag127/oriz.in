export function initApiFilter(): void {
  const search = document.querySelector<HTMLInputElement>('#api-filter');
  const category = document.querySelector<HTMLSelectElement>('#api-category');
  const count = document.querySelector<HTMLElement>('#api-count');
  const empty = document.querySelector<HTMLElement>('#api-empty');
  const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-api-card]'));
  const groups = Array.from(document.querySelectorAll<HTMLElement>('[data-api-group]'));
  if (!search || !category || cards.length === 0) return;

  const update = () => {
    const tokens = search.value.trim().toLocaleLowerCase().split(/\s+/u).filter(Boolean);
    let visible = 0;
    for (const card of cards) {
      const haystack = card.dataset.apiSearch ?? '';
      const matchesSearch = tokens.every((token) => haystack.includes(token));
      const matchesCategory =
        !category.value || card.dataset.apiCategory === category.value;
      const show = matchesSearch && matchesCategory;
      card.hidden = !show;
      if (show) visible += 1;
    }
    for (const group of groups) {
      group.hidden = !Array.from(
        group.querySelectorAll<HTMLElement>('[data-api-card]'),
      ).some((card) => !card.hidden);
    }
    if (count) count.textContent = `${visible} of ${cards.length} APIs`;
    if (empty) empty.hidden = visible !== 0;
  };

  search.addEventListener('input', update);
  category.addEventListener('change', update);
  update();
}
