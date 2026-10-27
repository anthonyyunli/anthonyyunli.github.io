export const metadata = {
  title: 'Blog',
  description: 'Notes and devlogs by Anthony Li.',
};

export default function Blog() {
  return (
    <section className="page-content" aria-labelledby="blog-title">
      <h1 className="page-title" id="blog-title">Blog</h1>
      <p className="empty-blog">No posts yet.</p>
      {/* Add links to real posts here when published. */}
    </section>
  );
}
