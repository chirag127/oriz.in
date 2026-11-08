export function initToolFilter(): void {
  const search = document.querySelector<HTMLInputElement>('#tool-filter');
  const category = document.querySelector<HTMLSelectElement>('#tool-category');
  const count = document.querySelector<HTMLElement>('#tool-count');
  const empty = document.querySelector<HTMLElement>('#tool-empty');
  const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-tool-card]'));
  const groups = Array.from(document.querySelectorAll<HTMLElement>('[data-tool-group]'));
  if (!search || !category || cards.length === 0) return;

  const update = () => {
    const tokens = search.value.trim().toLocaleLowerCase().split(/\s+/u).filter(Boolean);
    const selectedCategory = category.value;
    let visible = 0;

    for (const card of cards) {
      const haystack = card.dataset.toolSearch ?? '';
      const matchesSearch = tokens.every((token) => haystack.includes(token));
      const matchesCategory =
        !selectedCategory || card.dataset.toolCategory === selectedCategory;
      const show = matchesSearch && matchesCategory;
      card.hidden = !show;
      if (show) visible += 1;
    }

    for (const group of groups) {
      const groupCards = group.querySelectorAll<HTMLElement>('[data-tool-card]');
      group.hidden = !Array.from(groupCards).some((card) => !card.hidden);
    }

    if (count) {
      count.textContent = `${visible} of ${cards.length} tools`;
    }
    if (empty) empty.hidden = visible !== 0;
  };

  search.addEventListener('input', update);
  category.addEventListener('change', update);
  update();
}
