(function () {
  var key = 'oriz-theme';
  var root = document.documentElement;
  var media = window.matchMedia('(prefers-color-scheme: dark)');

  function storedTheme() {
    try {
      var value = window.localStorage.getItem(key);
      return value === 'light' || value === 'dark' ? value : null;
    } catch (error) {
      return null;
    }
  }

  function apply(theme) {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    var button = document.querySelector('[data-theme-toggle]');
    if (button) {
      var isDark = theme === 'dark';
      button.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      button.setAttribute('title', isDark ? 'Switch to light theme' : 'Switch to dark theme');
    }
    window.dispatchEvent(
      new CustomEvent('oriz:themechange', { detail: { theme: theme } }),
    );
  }

  document.addEventListener('click', function (event) {
    var target = event.target;
    if (!(target instanceof Element)) return;
    var button = target.closest('[data-theme-toggle]');
    if (!button) return;
    var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try {
      window.localStorage.setItem(key, next);
    } catch (error) {
      /* Theme still changes for this page view. */
    }
    apply(next);
  });

  media.addEventListener('change', function () {
    if (!storedTheme()) {
      apply(media.matches ? 'dark' : 'light');
    }
  });

  var initial = root.dataset.theme === 'dark' ? 'dark' : 'light';
  apply(initial);
})();
