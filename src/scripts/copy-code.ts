export function initCodeCopy(): void {
  const blocks = document.querySelectorAll<HTMLElement>('.code-block');
  for (const block of blocks) {
    if (block.querySelector('.code-copy')) continue;
    const code = block.querySelector('pre')?.textContent ?? '';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'code-copy';
    button.textContent = 'Copy';
    button.setAttribute('aria-label', 'Copy code');
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(code);
        button.textContent = 'Copied';
      } catch {
        button.textContent = 'Copy failed';
      }
      window.setTimeout(() => {
        button.textContent = 'Copy';
      }, 2000);
    });
    block.append(button);
  }
}
