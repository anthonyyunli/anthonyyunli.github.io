// Progressive enhancement: every page is usable without this file.
const terminal = document.querySelector('[data-terminal]');
if (terminal) {
  const form = terminal.querySelector('form');
  const input = terminal.querySelector('input');
  const output = terminal.querySelector('[data-terminal-output]');
  const routes = { home: '/', '~': '/', '/': '/', about: '/about/', blog: '/blog/', projects: '/projects/' };
  terminal.hidden = false;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const command = input.value.trim().toLowerCase();
    if (!command) return;
    input.value = '';
    const destination = command.replace(/^cd\s+/, '').replace(/^\.\//, '').replace(/\/$/, '') || '/';
    if (Object.hasOwn(routes, destination)) {
      window.location.assign(routes[destination]);
      return;
    }
    const responses = {
      help: 'Try: home, about, blog, projects\nAlso: ls, whoami, clear. Press / to focus, Esc to leave.',
      ls: 'home/    about/    blog/    projects/',
      whoami: 'Anthony Li — CS @ UofT. Competitive programmer & game developer.',
      pwd: window.location.pathname,
    };
    output.textContent = command === 'clear' ? '' : Object.hasOwn(responses, command)
      ? responses[command]
      : `Command not found: ${command.slice(0, 80)}\nType help to see the available commands.`;
  });

  document.addEventListener('keydown', (event) => {
    const editing = event.target instanceof Element && Boolean(event.target.closest('input, textarea, select, [contenteditable]'));
    if (event.key === '/' && !editing && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      input.focus();
    }
    if (event.key === 'Escape' && document.activeElement === input) input.blur();
  });
}
