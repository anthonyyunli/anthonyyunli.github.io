import CommandLine from '../components/CommandLine';
import AsciiRabbit from '../components/AsciiRabbit';

export default function Home() {
  return (
    <section className="home" aria-labelledby="home-title">
      <div className="terminal-pane ascii-pane">
        <AsciiRabbit />
      </div>
      <div className="terminal-pane shell-pane">
        <div className="shell-content">
          <div className="home-inner">
            <CommandLine>whoami</CommandLine>
            <h1 id="home-title">Anthony Li</h1>
            <div className="home-directory">
              <CommandLine>ls</CommandLine>
              <div className="file-list" aria-label="Explore the site">
                <a href="/about/">about.txt</a>
                <a href="/blog/">blog/</a>
                <a href="/projects/">projects/</a>
              </div>
            </div>
            <div className="idle-prompt" aria-hidden="true"><span className="prompt-dollar">$</span> <span className="cursor" /></div>
          </div>
        </div>
      </div>
    </section>
  );
}
