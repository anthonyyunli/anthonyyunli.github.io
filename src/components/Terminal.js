'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { aboutParagraphs, projects } from '../data/site';

// Directories mirror page URLs. Files reference the same content as the pages.
const filesystem = {
  '/': { kind: 'directory', href: '/' },
  '/about': { kind: 'directory', href: '/about/' },
  '/blog': { kind: 'directory', href: '/blog/' },
  '/projects': { kind: 'directory', href: '/projects/' },
  '/about/about.txt': { kind: 'file', href: '/about/', content: aboutParagraphs.join('\n\n') },
  ...Object.fromEntries(projects.map((project) => [
    '/projects/' + project.id + '.txt',
    {
      kind: 'file',
      href: '/projects/#' + project.id,
      content: [project.title, project.role, project.stack, project.description, project.href].filter(Boolean).join('\n'),
    },
  ])),
};

function tokenize(line) {
  const tokens = [];
  let token = '', quote = '', escaped = false, started = false;
  for (const character of line) {
    if (escaped) {
      token += character;
      escaped = false;
    } else if (character === '\\' && quote !== "'") {
      escaped = true;
      started = true;
    } else if (quote) {
      if (character === quote) quote = '';
      else token += character;
    } else if (character === '"' || character === "'") {
      quote = character;
      started = true;
    } else if (/\s/.test(character)) {
      if (started) tokens.push(token);
      token = '';
      started = false;
    } else {
      token += character;
      started = true;
    }
  }
  if (quote || escaped) throw new Error('syntax error: unfinished quote or escape');
  if (started) tokens.push(token);
  return tokens;
}

function resolvePath(cwd, input = '.') {
  if (!input) throw new Error('empty path');
  const path = input === '~' || input.startsWith('~/') ? '/' + input.slice(1) : input;
  let current = path.startsWith('/') ? '/' : cwd;
  for (const part of path.split('/')) {
    // Check before collapsing dots, so file/.. and file/ cannot become valid paths.
    if (filesystem[current].kind !== 'directory') throw new Error(input + ': not a directory');
    if (!part || part === '.') continue;
    if (part === '..') current = current.slice(0, current.lastIndexOf('/')) || '/';
    else current = (current === '/' ? '' : current) + '/' + part;
    if (!Object.hasOwn(filesystem, current)) throw new Error(input + ': no such file or directory');
  }
  return current;
}

function listDirectory(path) {
  const paths = filesystem[path].kind === 'file' ? [path] : Object.keys(filesystem).filter((key) =>
    key !== path && (key.slice(0, key.lastIndexOf('/')) || '/') === path);
  return paths.sort().map((key) => ({
    path: key,
    name: key.slice(key.lastIndexOf('/') + 1) + (filesystem[key].kind === 'directory' ? '/' : ''),
    href: filesystem[key].href,
  }));
}

// Add commands here. Handlers return data; only the UI performs navigation.
const commands = {
  whoami(args) {
    if (args.length) throw new Error('usage: whoami');
    return { kind: 'text', text: 'Anthony Li' };
  },
  pwd(args, cwd) {
    if (args.length) throw new Error('usage: pwd');
    return { kind: 'text', text: cwd };
  },
  ls(args, cwd) {
    if (args.length > 1) throw new Error('usage: ls [path]');
    return { kind: 'listing', entries: listDirectory(resolvePath(cwd, args[0])) };
  },
  cd(args, cwd) {
    if (args.length > 1) throw new Error('usage: cd [path]');
    const path = resolvePath(cwd, args[0] ?? '~');
    if (filesystem[path].kind !== 'directory') throw new Error(args[0] + ': not a directory');
    return { kind: 'navigate', href: filesystem[path].href };
  },
  cat(args, cwd) {
    if (args.length !== 1) throw new Error('usage: cat <file>');
    const path = resolvePath(cwd, args[0]);
    if (filesystem[path].kind !== 'file') throw new Error(args[0] + ': is a directory');
    return { kind: 'text', text: filesystem[path].content };
  },
  clear(args) {
    if (args.length) throw new Error('usage: clear');
    return { kind: 'clear' };
  },
  sudo() {
    return { kind: 'text', text: "Sudo access granted! Just kidding. I don't even know who you are." };
  },
  rm(args) {
    if (args[0] !== '-rf') throw new Error('rm: command not found');
    return { kind: 'removal' };
  },
};

function execute(line, cwd) {
  try {
    const [command, ...args] = tokenize(line);
    if (!Object.hasOwn(commands, command)) throw new Error(command + ': command not found');
    return commands[command](args, cwd);
  } catch (error) {
    return { kind: 'text', text: error.message };
  }
}

function Prompt({ path = '/', full = true }) {
  return (
    <span className="prompt-prefix">
      {full && <><span className="prompt-user">anthony@0xc0ffee</span>:<span className="prompt-path">{path === '/' ? '~' : '~' + path}</span>{' '}</>}
      <span className="prompt-dollar">$</span>
    </span>
  );
}

export function CommandLine({ children, path = '/' }) {
  return (
    <p className="command-line">
      <Prompt path={path} />
      <span className="command-text">{children}</span>
    </p>
  );
}

export function DirectoryLinks({ entries = listDirectory('/') }) {
  return (
    <div className="file-list" aria-label="Directory contents">
      {entries.map(({ path, name, href }) => <a key={path} href={href}>{name}</a>)}
    </div>
  );
}

const removalLines = [
  '/bin/bash', '/etc/passwd', '/usr/lib/libc.so.6',
  ...Array.from({ length: 96 }, (_, index) => '/usr/lib/libuniverse-' + String(index).padStart(3, '0') + '.so'),
  '/dev/null', '/var/log/universe.log', '/home/anthony/.coffee',
].map((path) => 'removing ' + path + '...');

function FakeRemoval() {
  const [visible, setVisible] = useState(0);
  const [finished, setFinished] = useState(false);
  const log = useRef(null);
  useEffect(() => {
    log.current.scrollTop = log.current.scrollHeight;
    let timer;
    if (finished) {
      timer = setTimeout(() => window.location.reload(), 1600);
    } else if (visible === removalLines.length) {
      timer = setTimeout(() => setFinished(true), 350);
    } else {
      const delay = visible === 0 ? 350 : visible <= 3 ? 450 : 45;
      const count = Math.min(removalLines.length, visible + (visible < 3 ? 1 : 12));
      timer = setTimeout(() => setVisible(count), delay);
    }
    return () => clearTimeout(timer);
  }, [visible, finished]);
  return (
    <div className="terminal-removal">
      <pre ref={log} aria-live="off">{removalLines.slice(0, visible).join('\n')}</pre>
      {finished && <div role="status">jk. Rebooting universe</div>}
    </div>
  );
}

export function PageTerminal() {
  const pathname = usePathname();
  const cwd = pathname.replace(/\/+$/, '') || '/';
  if (cwd === '/' || filesystem[cwd]?.kind !== 'directory') return null;
  return <div className="page-terminal"><Terminal key={cwd} cwd={cwd} /></div>;
}

export default function Terminal({ cwd = '/' }) {
  const [history, setHistory] = useState([]);
  const [active, setActive] = useState(false);
  const commandInput = useRef(null);
  const busy = history.at(-1)?.result.kind === 'removal';

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
      field.focus();
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
    field.parentElement.style.setProperty('--cursor-x', 'calc(' + field.selectionStart + 'ch - ' + field.scrollLeft + 'px)');
    if (field.value) setActive(true);
  }

  function run(event) {
    event.preventDefault();
    if (busy) return;
    const field = commandInput.current;
    const input = field.value;
    field.value = '';
    updateCursor();
    if (!input.trim()) return;
    const result = execute(input, cwd);
    if (result.kind === 'navigate') {
      window.location.assign(result.href);
      return;
    }
    if (result.kind === 'clear') {
      setHistory([]);
      return;
    }
    setHistory((previous) => [...previous.slice(-7), { command: input, cwd, result }]);
  }

  return (
    <div className="idle-prompt">
      <div className="terminal-history" aria-live="polite" aria-relevant="additions">
        {history.map(({ command, cwd: directory, result }, index) => (
          <div key={index}>
            <CommandLine path={directory}>{command}</CommandLine>
            <div className="terminal-output">
              {result.kind === 'text' && result.text}
              {result.kind === 'listing' && <DirectoryLinks entries={result.entries} />}
              {result.kind === 'removal' && <FakeRemoval />}
            </div>
          </div>
        ))}
      </div>
      <form className="terminal-form" onSubmit={run} aria-label="Site terminal">
        <Prompt path={cwd} full={active} />
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
