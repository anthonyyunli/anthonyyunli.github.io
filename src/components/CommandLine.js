export default function CommandLine({ children, path = '~' }) {
  return (
    <p className="command-line">
      <span className="prompt-prefix"><span className="prompt-user">anthony@0xc0ffee</span>:<span className="prompt-path">{path}</span><span className="prompt-dollar"> $</span></span>
      <span className="command-text">{children}</span>
    </p>
  );
}
