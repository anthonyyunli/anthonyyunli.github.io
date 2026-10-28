import CommandLine from '../../components/CommandLine';

export const metadata = {
  title: 'About',
  description: 'A little about Anthony Li.',
};

export default function About() {
  return (
    <section className="page-content about-page" aria-labelledby="about-title">
      <CommandLine>cat about.txt</CommandLine>
      <h1 className="page-title" id="about-title">about.txt</h1>
      <div className="about-layout">
        <img className="about-photo" src="/images/about.webp" alt="Anthony at an event, wearing a Santa hat." width={1200} height={900} decoding="async" />
        <div className="about-copy">
          <p>I&apos;m Anthony, a CS student at UofT. I like ML, algorithms, and building things from scratch. I&apos;ve worked on CanSat, led Mayhem, and lately been experimenting with compact text detectors.</p>
          <p>Outside of code, I lift, run, and occasionally commit to an unnecessarily long bike ride.</p>
        </div>
      </div>
      {/* Résumé intentionally left blank. */}
    </section>
  );
}
