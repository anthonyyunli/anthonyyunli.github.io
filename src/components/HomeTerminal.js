'use client';

import { useState } from 'react';

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

  function run(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const input = new FormData(form).get('command').trim();
    form.reset();
    if (!input) return;

    const [command, argument] = input.split(/\s+/);
    let output;

    switch (command) {
      case 'whoami':
        output = 'Anthony Li';
        break;
      case 'ls':
        output = 'about.txt  blog/  projects/';
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
      case 'help':
        output = 'whoami · ls · cd <about|blog|projects> · clear';
        break;
      default:
        output = `${command}: command not found. Try help.`;
    }

    setHistory((previous) => [...previous.slice(-7), { command: input, output }]);
  }

  return (
    <div className="idle-prompt">
      <div className="terminal-history" aria-live="polite" aria-relevant="additions">
        {history.map(({ command, output }, index) => (
          <div key={index}>
            <div><span className="prompt-dollar">$</span> {command}</div>
            <p>{output}</p>
          </div>
        ))}
      </div>
      <form className="terminal-form" onSubmit={run} aria-label="Home terminal">
        <span className="prompt-dollar" aria-hidden="true">$</span>
        <span className="terminal-field">
          <input
            className="terminal-input"
            name="command"
            aria-label="Terminal command"
            placeholder=" "
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
