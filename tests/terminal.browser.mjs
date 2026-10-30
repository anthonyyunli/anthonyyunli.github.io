// Run with Node 22+, a static server on 3001 and a browser's CDP port on 9223.
import assert from 'node:assert/strict';

const origin = process.env.SITE_URL || 'http://127.0.0.1:3001';
const debug = process.env.BROWSER_DEBUG_URL || 'http://127.0.0.1:9223';
const tabs = await fetch(debug + '/json/list').then((response) => response.json());
const socket = new WebSocket(tabs.find((tab) => tab.type === 'page').webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve, { once: true });
  socket.addEventListener('error', reject, { once: true });
});
let sequence = 0;
const pending = new Map();
const exceptions = [];
socket.addEventListener('message', ({ data }) => {
  const message = JSON.parse(data);
  if (message.id) {
    const task = pending.get(message.id);
    pending.delete(message.id);
    message.error ? task.reject(new Error(message.error.message)) : task.resolve(message.result);
  }
  if (message.method === 'Runtime.exceptionThrown') exceptions.push(message.params.exceptionDetails.text);
});
function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++sequence;
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
}
async function evaluate(callback, ...args) {
  const expression = '(' + callback.toString() + ')(' + args.map((arg) => JSON.stringify(arg)).join(',') + ')';
  const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
  return result.result.value;
}
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function waitFor(callback, ...args) {
  const start = Date.now();
  while (Date.now() - start < 15000) {
    if (await evaluate(callback, ...args)) return;
    await pause(40);
  }
  throw new Error('Timed out: ' + callback.toString());
}
async function load(path) {
  const url = new URL(path, origin);
  await send('Page.navigate', { url: url.href });
  await waitFor((pathname) => location.pathname === pathname && document.readyState === 'complete' &&
    !!document.querySelector('.terminal-input'), url.pathname);
  await pause(150);
}
async function key(key, code, text) {
  for (const type of ['keyDown', 'keyUp']) {
    await send('Input.dispatchKeyEvent', {
      type, key, code: key, windowsVirtualKeyCode: code, nativeVirtualKeyCode: code,
      ...(type === 'keyDown' && text ? { text } : {}),
    });
  }
}
async function command(text) {
  await evaluate(() => document.querySelector('.terminal-input').focus());
  await send('Input.insertText', { text });
  await key('Enter', 13, '\r');
  await pause(80);
}
const output = () => evaluate(() => [...document.querySelectorAll('.terminal-output')].at(-1)?.innerText);
const links = () => evaluate(() => {
  const last = [...document.querySelectorAll('.terminal-output')].at(-1);
  return [...(last?.querySelectorAll('a') || [])].map((a) => [a.textContent, a.getAttribute('href')]);
});

try {
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Network.enable');
  await send('Network.setCacheDisabled', { cacheDisabled: true });
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await load('/');
  await command('pwd');
  assert.equal(await output(), '/', 'pwd uses the URL current directory');
  await command('ls');
  assert.deepEqual(await links(), [['about/', '/about/'], ['blog/', '/blog/'], ['projects/', '/projects/']]);
  await command('ls projects');
  assert.deepEqual((await links()).map(([name]) => name),
    ['breckeys.txt', 'cansat.txt', 'cs229.txt', 'mayhem.txt', 'substracker.txt']);
  await command('ls projects/cansat.txt');
  assert.deepEqual(await links(), [['cansat.txt', '/projects/#cansat']]);
  await command('cat projects/cansat.txt');
  assert.match(await output(), /CanSat Design Challenge/);
  assert.match(await output(), /https:\/\/github.com\/CantSatTeam\/CanSat-MHE/);
  await command('cat "about/about.txt"');
  const aboutText = await output();
  assert.match(aboutText, /Outside of code/);
  await command('cat about\/about.txt');
  assert.equal(await output(), aboutText);

  for (const text of ['cd about/about.txt', 'cd about/about.txt/..', 'ls about/about.txt/',
    'cat about/about.txt/child', 'ls about/about.txt//', 'cd projects/cansat.txt/../..']) {
    await command(text);
    assert.match(await output(), /not a directory/i, text);
    assert.equal(await evaluate(() => location.pathname), '/');
  }
  for (const text of ['cat projects', 'cat /']) {
    await command(text);
    assert.match(await output(), /is a directory/i);
  }
  for (const text of ['ls missing/..', 'ls __proto__', 'ls "missing folder"']) {
    await command(text);
    assert.match(await output(), /no such file or directory/i);
  }
  await command('ls missing\\ ');
  assert.match(await output(), /no such file or directory/i, 'an escaped trailing space is part of the path');
  for (const text of ['whoami extra', 'pwd extra', 'ls a b', 'cat', 'cat a b', 'cd a b', 'clear extra']) {
    await command(text);
    assert.match(await output(), /usage:/i, text);
  }
  for (const text of ['cat "unfinished', "cat 'unfinished", 'ls trailing\\']) {
    await command(text);
    assert.match(await output(), /syntax error/i);
  }
  await command('ls ""');
  assert.match(await output(), /empty path/i);
  for (const text of ['help', 'constructor', '__proto__', 'toString']) {
    await command(text);
    assert.match(await output(), /command not found/);
  }
  assert.equal(await evaluate(() => document.querySelectorAll('.terminal-history > div').length), 8);
  await command('clear');
  assert.equal(await evaluate(() => document.querySelector('.terminal-history').textContent), '');

  await command('cd "projects"');
  await waitFor(() => location.pathname === '/projects/' && document.readyState === 'complete');
  await pause(150);
  await command('pwd');
  assert.equal(await output(), '/projects');
  await command('ls .');
  assert.equal((await links()).length, 5);
  await command('cat cansat.txt');
  assert.match(await output(), /CanSat Design Challenge/);
  await command('cd ../blog');
  await waitFor(() => location.pathname === '/blog/' && document.readyState === 'complete');
  await pause(150);
  await command('pwd');
  assert.equal(await output(), '/blog');
  await command('ls');
  assert.deepEqual(await links(), []);
  await command('cd ../../../../');
  await waitFor(() => location.pathname === '/' && document.readyState === 'complete');
  await pause(150);
  await command('cd pro\\jects');
  await waitFor(() => location.pathname === '/projects/' && document.readyState === 'complete');
  await pause(150);
  await command('cd ~/about');
  await waitFor(() => location.pathname === '/about/' && document.readyState === 'complete');
  await pause(150);
  await command('cat about.txt');
  assert.equal(await output(), aboutText);
  const paragraphs = await evaluate(() => [...document.querySelectorAll('.about-copy p')].map((p) => p.textContent).join('\n\n'));
  assert.equal(aboutText, paragraphs);
  await command('cd');
  await waitFor(() => location.pathname === '/' && document.readyState === 'complete');

  const navigation = await send('Page.getNavigationHistory');
  await send('Page.navigateToHistoryEntry', { entryId: navigation.entries[navigation.currentIndex - 1].id });
  await waitFor(() => location.pathname === '/about/' && document.readyState === 'complete');
  await pause(150);
  await command('pwd');
  assert.equal(await output(), '/about');
  await send('Page.navigateToHistoryEntry', { entryId: navigation.entries[navigation.currentIndex].id });
  await waitFor(() => location.pathname === '/' && document.readyState === 'complete');

  await load('/');
  assert.equal(await evaluate(() => document.querySelector('.terminal-form .prompt-prefix').textContent), '$');
  await key('w', 87, 'w');
  await send('Input.insertText', { text: 'hoami' });
  await pause(40);
  assert.equal(await evaluate(() => document.querySelector('.terminal-input').value), 'whoami');
  assert.equal(await evaluate(() => document.querySelector('.terminal-form .prompt-prefix').textContent),
    'anthony@0xc0ffee:~ $');
  await key('ArrowLeft', 37);
  await pause(40);
  const cursor = await evaluate(() => {
    const input = document.querySelector('.terminal-input');
    const block = document.querySelector('.cursor');
    const measure = document.createElement('canvas').getContext('2d');
    measure.font = getComputedStyle(input).font;
    return {
      width: block.offsetWidth, display: getComputedStyle(block).display,
      native: getComputedStyle(input).caretColor,
      actual: block.getBoundingClientRect().left - input.getBoundingClientRect().left,
      expected: input.selectionStart * measure.measureText('0').width - input.scrollLeft,
    };
  });
  assert.equal(cursor.width, 8);
  assert.notEqual(cursor.display, 'none');
  assert.equal(cursor.native, 'rgba(0, 0, 0, 0)');
  assert.ok(Math.abs(cursor.actual - cursor.expected) < 1);
  await key('End', 35);
  await key('Enter', 13, '\r');
  await pause(50);
  await command('x'.repeat(180));
  assert.equal(await evaluate(() => [...document.querySelectorAll('.terminal-history .command-text')]
    .at(-1).textContent.length), 160);
  assert.equal(await evaluate(() => document.querySelector('.terminal-input').value), '');
  await command('clear');
  await evaluate(() => document.querySelector('.terminal-input').blur());
  for (const modifier of ['ctrlKey', 'metaKey', 'altKey', 'isComposing']) {
    assert.equal(await evaluate((modifier) => {
      const event = new KeyboardEvent('keydown', { key: 'a', [modifier]: true, bubbles: true, cancelable: true });
      document.body.dispatchEvent(event);
      return event.defaultPrevented || document.activeElement.className === 'terminal-input';
    }, modifier), false);
  }
  await evaluate(() => {
    const field = document.createElement('textarea');
    field.id = 'other-input';
    document.body.append(field);
    field.focus();
    field.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }));
  });
  assert.equal(await evaluate(() => document.activeElement.id), 'other-input');
  await evaluate(() => document.querySelector('#other-input').remove());

  for (const width of [1440, 768, 390, 320]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: 1, mobile: false });
    const offsets = [];
    for (const page of ['about', 'blog', 'projects']) {
      await load('/' + page + '/?check=1#test');
      assert.equal(await evaluate(() => document.querySelectorAll('.terminal-input').length), 1);
      assert.equal(await evaluate(() => !!document.querySelector('.page-terminal .terminal-input')), true);
      await command('pwd');
      assert.equal(await output(), '/' + page);
      const state = await evaluate(() => ({
        prompt: document.querySelector('.terminal-form .prompt-prefix').textContent,
        overflow: document.documentElement.scrollWidth > innerWidth,
        left: document.querySelector('.page-content > .command-line').getBoundingClientRect().left,
        bottomLeft: document.querySelector('.terminal-form').getBoundingClientRect().left,
      }));
      assert.equal(state.prompt, 'anthony@0xc0ffee:~/' + page + ' $');
      assert.equal(state.overflow, false);
      assert.ok(Math.abs(state.left - state.bottomLeft) < 1);
      offsets.push(state.left);
    }
    assert.equal(new Set(offsets).size, 1);
  }

  await load('/projects/');
  await evaluate(() => { scrollTo(0, 0); document.querySelector('.terminal-input').blur(); });
  await key('p', 80, 'p');
  await send('Input.insertText', { text: 'wd' });
  await pause(50);
  assert.equal(await evaluate(() => {
    const rect = document.querySelector('.terminal-input').getBoundingClientRect();
    return rect.top >= 0 && rect.bottom <= innerHeight;
  }), true, 'typing reveals the bottom prompt');
  await key('Enter', 13, '\r');
  await pause(50);
  assert.equal(await output(), '/projects');
  const start = await evaluate(() => performance.timeOrigin);
  await command('sudo rm -rf /');
  assert.equal(await output(), "Sudo access granted! Just kidding. I don't even know who you are.");
  await command('rm -rf /');
  assert.equal(await evaluate(() => document.querySelector('.terminal-input').readOnly), true);
  await pause(360);
  const early = await evaluate(() => document.querySelector('.terminal-removal pre').textContent.split('\n').filter(Boolean).length);
  assert.ok(early >= 1 && early <= 2);
  await pause(1400);
  const fast = await evaluate(() => document.querySelector('.terminal-removal pre').textContent.split('\n').filter(Boolean).length);
  assert.ok(fast > 12);
  await waitFor(() => !!document.querySelector('.terminal-removal [role="status"]'));
  assert.equal(await evaluate(() => document.querySelector('.terminal-removal [role="status"]').textContent),
    'jk. Rebooting universe');
  await waitFor((time) => performance.timeOrigin !== time && document.readyState === 'complete' &&
    !!document.querySelector('.terminal-input'), start);
  assert.equal(await evaluate(() => location.pathname), '/projects/');
  await pause(150);
  await command('pwd');
  assert.equal(await output(), '/projects');
  assert.deepEqual(exceptions, []);
  console.log('PASS: filesystem commands, path traversal, parsing, shared content, bottom prompts, responsive layout, jokes and reload.');
} finally {
  socket.close();
}
