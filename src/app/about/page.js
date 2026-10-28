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
        <img className="about-photo" src="/images/about-3499.webp" alt="Anthony standing among tall trees in a forest." width={1000} height={1564} decoding="async" />
        <div className="about-copy">
          <p>I&apos;m Anthony, a CS student at UofT. I like ML, algorithms, and building things from scratch. I&apos;ve worked on CanSat, led Mayhem, and lately been experimenting with compact text detectors.</p>
          <p>Outside of code, I lift, run, and occasionally commit to an unnecessarily long bike ride.</p>
        </div>
      </div>
      {/* Résumé intentionally left blank. */}
    </section>
  );
}
