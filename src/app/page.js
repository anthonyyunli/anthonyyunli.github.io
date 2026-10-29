import CommandLine from '../components/CommandLine';
import AsciiRabbit from '../components/AsciiRabbit';
import HomeTerminal from '../components/HomeTerminal';
import DirectoryLinks from '../components/DirectoryLinks';

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
          <HomeTerminal />
        </div>
      </div>
    </section>
  );
}
