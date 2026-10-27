import CommandLine from '../components/CommandLine';

export default function Home() {
  return (
    <section className="home" aria-labelledby="home-title">
      <div className="home-inner">
        <CommandLine>whoami</CommandLine>
        <h1 id="home-title">Anthony Li</h1>
        <p className="home-bio">CS at UofT. Mostly machine learning, algorithms, and game development.</p>
        <p className="home-note">I build things from scratch to understand how they work.</p>
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
    </section>
  );
}
