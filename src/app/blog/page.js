import CommandLine from '../../components/CommandLine';

export const metadata = {
  title: 'Blog',
  description: 'Notes and devlogs by Anthony Li.',
};

export default function Blog() {
  return (
    <section className="page-content" aria-labelledby="blog-title">
      <CommandLine>ls blog/</CommandLine>
      <h1 className="page-title" id="blog-title">blog/</h1>
      <div className="empty-blog"><p className="entry-count">total 0</p><p>No posts yet.</p></div>
      {/* Add links to real posts here when published. */}
    </section>
  );
}
