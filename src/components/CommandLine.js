export function Prompt({ path = '~', full = true }) {
  return (
    <span className="prompt-prefix">
      {full && <><span className="prompt-user">anthony@0xc0ffee</span>:<span className="prompt-path">{path}</span>{' '}</>}
      <span className="prompt-dollar">$</span>
    </span>
  );
}

export default function CommandLine({ children, path = '~' }) {
  return (
    <p className="command-line">
      <Prompt path={path} />
      <span className="command-text">{children}</span>
    </p>
  );
}
