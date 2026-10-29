'use client';

import { useEffect, useRef, useState } from 'react';
import CommandLine, { Prompt } from './CommandLine';
import DirectoryLinks from './DirectoryLinks';
import FakeRemoval from './FakeRemoval';

const destinations = {
  '': '/',
  '.': '/',
  '..': '/',
  '~': '/',
  home: '/',
  about: '/about/',
  'about.txt': '/about/',
  blog: '/blog/',
  projects: '/projects/',
};

export default function HomeTerminal() {
  const [history, setHistory] = useState([]);
  const [active, setActive] = useState(false);
  const commandInput = useRef(null);
  const busy = history.at(-1)?.removing ?? false;

  useEffect(() => {
    function startTyping(event) {
      if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey ||
          event.isComposing || !/^[a-z0-9]$/i.test(event.key)) return;

      const target = event.target;
      if (target instanceof HTMLElement &&
          (target.isContentEditable || target.closest('input, textarea, select'))) return;

      const field = commandInput.current;
      if (field.readOnly) return;
      event.preventDefault();
      field.focus({ preventScroll: true });
      if (field.value.length < field.maxLength) {
        field.setRangeText(event.key, field.selectionStart, field.selectionEnd, 'end');
        field.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }

    window.addEventListener('keydown', startTyping);
    return () => window.removeEventListener('keydown', startTyping);
  }, []);

  function updateCursor() {
    const field = commandInput.current;
    field.parentElement.style.setProperty('--cursor-x', `calc(${field.selectionStart}ch - ${field.scrollLeft}px)`);
    if (field.value) setActive(true);
  }

  function run(event) {
    event.preventDefault();
    if (busy) return;
    const field = commandInput.current;
    const input = field.value.trim();
    field.value = '';
    updateCursor();
    if (!input) return;

    const [command, argument] = input.split(/\s+/);
    let output = `${command}: command not found`;
    let removing = false;

    switch (command) {
      case 'whoami':
        output = 'Anthony Li';
        break;
      case 'ls':
        output = <DirectoryLinks />;
        break;
      case 'cd': {
        const directory = (argument || '').replace(/^~?\//, '').replace(/\/$/, '');
        if (Object.hasOwn(destinations, directory)) {
          window.location.assign(destinations[directory]);
          return;
        }
        output = `cd: ${argument}: no such directory`;
        break;
      }
      case 'clear':
        setHistory([]);
        return;
      case 'sudo':
        output = "Sudo access granted! Just kidding. I don't even know who you are.";
        break;
      case 'rm':
        removing = argument === '-rf';
        if (removing) output = <FakeRemoval />;
        break;
    }

    setHistory((previous) => [...previous.slice(-7), { command: input, output, removing }]);
  }

  return (
    <div className="idle-prompt">
      <div className="terminal-history" aria-live="polite" aria-relevant="additions">
        {history.map(({ command, output }, index) => (
          <div key={index}>
            <CommandLine>{command}</CommandLine>
            <div className="terminal-output">{output}</div>
          </div>
        ))}
      </div>
      <form className="terminal-form" onSubmit={run} aria-label="Home terminal">
        <Prompt full={active} />
        <span className="terminal-field">
          <input
            ref={commandInput}
            onInput={updateCursor}
            onSelect={updateCursor}
            onScroll={updateCursor}
            readOnly={busy}
            className="terminal-input"
            aria-label="Terminal command"
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            maxLength={160}
          />
          <span className="cursor" aria-hidden="true" />
        </span>
      </form>
    </div>
  );
}
