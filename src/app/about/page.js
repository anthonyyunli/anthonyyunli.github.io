import { CommandLine } from '../../components/Terminal';
import { aboutParagraphs } from '../../data/site';

export const metadata = {
  title: 'About',
  description: 'A little about Anthony Li.',
};

export default function About() {
  return (
    <section className="page-content about-page" aria-labelledby="about-title">
      <CommandLine path="/about">cat about.txt</CommandLine>
      <h1 className="page-title" id="about-title">about.txt</h1>
      <div className="about-layout">
        <img className="about-photo" src="/images/about-3499.webp" alt="Anthony standing among tall trees in a forest." width={1000} height={1564} decoding="async" />
        <div className="about-copy">
          {aboutParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </div>
      {/* Résumé intentionally left blank. */}
    </section>
  );
}
