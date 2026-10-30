import Terminal, { CommandLine, DirectoryLinks } from '../components/Terminal';
import AsciiRabbit from '../components/AsciiRabbit';

export default function Home() {
  return (
    <section className="home" aria-labelledby="home-title">
      <AsciiRabbit />
      <div className="shell-content">
        <div className="home-inner">
          <CommandLine>whoami</CommandLine>
          <h1 id="home-title">Anthony Li</h1>
          <div className="home-directory">
            <CommandLine>ls</CommandLine>
            <DirectoryLinks />
          </div>
          <Terminal />
        </div>
      </div>
    </section>
  );
}
