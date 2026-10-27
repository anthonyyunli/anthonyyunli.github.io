export const metadata = {
  title: 'About',
  description: 'About Anthony Li, a computer science student at UofT interested in ML, algorithms, and game development.',
};

export default function About() {
  return (
    <div className="about-page">
      <article className="about-panel prose">
        <h1>About me</h1>
        <h2>Hi, I&apos;m Anthony!</h2>
        <p>I&apos;m a computer science student at the University of Toronto, based in Toronto, Canada. I&apos;m mostly into machine learning, algorithms, and building things from scratch to understand how they work.</p>
        <p>I led software development for the <a href="/projects/#cansat">CanSat Design Challenge</a>, working on computer vision and mission software under tight hardware constraints. I also led a 12-person team building <a href="/projects/#mayhem">Mayhem</a>, a multiplayer game with over 200 players.</p>
        <p>Recently, I&apos;ve been exploring <a href="/projects/#compact-ai-text-detectors">compact AI text detectors</a> through an independent CS229 project. I usually work with C++, Python, Lua/Luau, Java, JavaScript, and C#.</p>
        <p>Outside of code, I like lifting, running, and occasionally talking myself into a 100 km bike ride.</p>
        <h2>Leadership &amp; achievements</h2>
        <ul>
          <li>Canadian Computing Competition Senior Honour Roll and Senior/Junior Distinction.</li>
          <li>Third place in UAPC 2025 Division 2.</li>
          <li>CanSat Educational Outreach Award with the team.</li>
          <li>Led robotics, computer science, and mathematics activities for student communities of 20–50+ members.</li>
        </ul>
        <p className="about-contact">GitHub: <a href="https://github.com/anthonyyunli">anthonyyunli</a></p>
        {/* Résumé intentionally left blank. Add a link when ready. */}
      </article>
    </div>
  );
}
