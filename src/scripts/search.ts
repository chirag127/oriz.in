interface SearchRecord {
  title: string;
  url: string;
  type: string;
  typeLabel: string;
  description: string;
  category: string;
  domain?: string;
  tags: string[];
  headings: string[];
  content: string;
}

interface SearchIndex {
  version: number;
  count: number;
  records: SearchRecord[];
}

const MAX_RESULTS = 30;

function initSearch(): void {
  const form = document.querySelector<HTMLFormElement>('#search-form');
  const input = document.querySelector<HTMLInputElement>('#search-input');
  const typeFilter = document.querySelector<HTMLSelectElement>('#search-type');
  const categoryFilter = document.querySelector<HTMLSelectElement>('#search-category');
  const domainFilter = document.querySelector<HTMLSelectElement>('#search-domain');
  const status = document.querySelector<HTMLElement>('#search-status');
  const results = document.querySelector<HTMLOListElement>('#search-results');
  const empty = document.querySelector<HTMLElement>('#search-empty');
  const emptyCopy = document.querySelector<HTMLElement>('#search-empty-copy');
  const keyboard = document.querySelector<HTMLElement>('#search-keyboard');
  if (!form || !input || !results || !status) return;

  const url = new URL(window.location.href);
  input.value = url.searchParams.get('q') ?? '';

  let index: SearchRecord[] | null = null;
  let loading = false;
  let loadError = false;
  let selectedIndex = -1;
  let debounce = 0;

  const setUrl = (query: string) => {
    const next = new URL(window.location.href);
    if (query) next.searchParams.set('q', query);
    else next.searchParams.delete('q');
    window.history.replaceState(null, '', next);
  };

  const loadIndex = async () => {
    if (index || loading) return;
    loading = true;
    status.textContent = 'Loading the search index…';
    try {
      const response = await fetch('/search-index.json');
      if (!response.ok) throw new Error('Index request failed.');
      const data = (await response.json()) as SearchIndex;
      index = Array.isArray(data.records) ? data.records : [];
      populateCategories(index);
      performSearch();
    } catch {
      loadError = true;
      status.textContent =
        'The search index could not be loaded. Browse the tools, articles, or categories instead.';
    } finally {
      loading = false;
    }
  };

  let populateCategoriesRun = false;
  const populateCategories = (records: SearchRecord[]) => {
    if (populateCategoriesRun || !categoryFilter) return;
    populateCategoriesRun = true;
    const categories = [...new Set(records.map((record) => record.category).filter(Boolean))].sort(
      (a, b) => a.localeCompare(b),
    );
    for (const category of categories) {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categoryFilter.append(option);
    }
  };

  const scoreRecord = (record: SearchRecord, query: string, tokens: string[]) => {
    const title = record.title.toLocaleLowerCase();
    const description = record.description.toLocaleLowerCase();
    const tags = record.tags.join(' ').toLocaleLowerCase();
    const headings = record.headings.join(' ').toLocaleLowerCase();
    const category = record.category.toLocaleLowerCase();
    const domain = (record.domain ?? '').toLocaleLowerCase();
    const content = (record.content ?? '').toLocaleLowerCase();
    const haystack = `${title} ${description} ${tags} ${headings} ${category} ${domain} ${content}`;
    if (!tokens.every((token) => haystack.includes(token))) return -1;

    let score = 0;
    if (title === query) score += 220;
    if (title.startsWith(query)) score += 100;
    if (title.includes(query)) score += 60;
    for (const token of tokens) {
      if (title.split(/\s+/u).includes(token)) score += 40;
      if (title.includes(token)) score += 25;
      if (tags.includes(token)) score += 14;
      if (headings.includes(token)) score += 10;
      if (description.includes(token)) score += 6;
      if (category.includes(token)) score += 4;
      if (content.includes(token)) score += 2;
    }
    if (record.type === 'tool') score += 3;
    return score;
  };

  const render = (records: SearchRecord[]) => {
    results.replaceChildren();
    empty?.setAttribute('hidden', '');
    keyboard?.setAttribute('hidden', '');
    selectedIndex = -1;

    if (records.length === 0) {
      empty?.removeAttribute('hidden');
      if (emptyCopy) {
        emptyCopy.textContent =
          'Try a shorter phrase, a different spelling, or browse the full tool and article directories.';
      }
      return;
    }

    const visible = records.slice(0, MAX_RESULTS);
    visible.forEach((record, index) => {
      const li = document.createElement('li');
      li.className = 'search-result';
      const link = document.createElement('a');
      link.href = record.url;
      link.id = `search-result-${index}`;

      const meta = document.createElement('div');
      meta.className = 'search-result-meta';
      const type = document.createElement('span');
      type.className = 'search-result-type';
      type.textContent = record.typeLabel;
      meta.append(type);
      if (record.category) {
        const category = document.createElement('span');
        category.textContent = record.category;
        meta.append(category);
      }

      const title = document.createElement('div');
      title.className = 'search-result-title';
      title.textContent = record.title;
      const description = document.createElement('p');
      description.className = 'search-result-desc';
      description.textContent = record.description;

      link.append(meta, title, description);
      li.append(link);
      results.append(li);
    });

    keyboard?.removeAttribute('hidden');
    if (status) {
      status.textContent =
        records.length > MAX_RESULTS
          ? `Showing the first ${MAX_RESULTS} of ${records.length} matches.`
          : `${records.length} ${records.length === 1 ? 'match' : 'matches'}.`;
    }
  };

  function performSearch(): void {
    if (!index) return;
    const query = input!.value.trim().toLocaleLowerCase();
    if (query.length < 2) {
      results!.replaceChildren();
      empty?.setAttribute('hidden', '');
      keyboard?.setAttribute('hidden', '');
      if (!loadError) {
        status!.textContent =
          query.length === 0
            ? 'Type at least two characters to search.'
            : 'Type one more character to search.';
      }
      return;
    }

    const tokens = query.split(/\s+/u).filter(Boolean);
    const type = typeFilter?.value ?? '';
    const category = categoryFilter?.value ?? '';
    const domain = domainFilter?.value ?? '';
    const scored = index
      .filter(
        (record) =>
          (!type || record.type === type) &&
          (!category || record.category === category) &&
          (!domain || record.domain === domain),
      )
      .map((record) => ({ record, score: scoreRecord(record, query, tokens) }))
      .filter((entry) => entry.score >= 0)
      .sort((a, b) => b.score - a.score || a.record.title.localeCompare(b.record.title))
      .map((entry) => entry.record);

    render(scored);
    setUrl(input!.value.trim());
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    performSearch();
  });

  input.addEventListener('input', () => {
    window.clearTimeout(debounce);
    debounce = window.setTimeout(performSearch, 140);
  });

  input.addEventListener('focus', () => {
    void loadIndex();
  });

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      input.value = '';
      performSearch();
      return;
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      const links = Array.from(
        results.querySelectorAll<HTMLAnchorElement>('a'),
      );
      if (links.length === 0) return;
      event.preventDefault();
      selectedIndex =
        event.key === 'ArrowDown'
          ? Math.min(links.length - 1, selectedIndex + 1)
          : Math.max(0, selectedIndex - 1);
      links.forEach((link, index) => {
        link.classList.toggle('is-selected', index === selectedIndex);
      });
      links[selectedIndex]?.scrollIntoView({ block: 'nearest' });
    }
    if (event.key === 'Enter' && selectedIndex >= 0) {
      const link = results.querySelectorAll<HTMLAnchorElement>('a')[selectedIndex];
      if (link) {
        event.preventDefault();
        window.location.href = link.href;
      }
    }
  });

  typeFilter?.addEventListener('change', performSearch);
  categoryFilter?.addEventListener('change', performSearch);

  document.querySelectorAll<HTMLButtonElement>('[data-search-suggestion]').forEach((button) => {
    button.addEventListener('click', () => {
      input.value = button.dataset.searchSuggestion ?? '';
      void loadIndex();
      performSearch();
      input.focus();
    });
  });

  void loadIndex();
}

initSearch();
