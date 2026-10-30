'use client';

import { usePathname } from 'next/navigation';

const pages = [
  { href: '/', label: 'home' },
  { href: '/about/', label: 'about' },
  { href: '/blog/', label: 'blog' },
  { href: '/projects/', label: 'projects' },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <a className="site-name" href="/"><span aria-hidden="true">&gt;_</span> anthonyyunli</a>
      <nav aria-label="Main navigation">
        {pages.map(({ href, label }) => (
          <a key={href} href={href} aria-current={pathname === href ? 'page' : undefined}>{label}</a>
        ))}
      </nav>
    </header>
  );
}
