import Header from '../components/Header';
import Footer from '../components/Footer';
import { PageTerminal } from '../components/Terminal';
import './globals.css';

export const metadata = {
  title: { default: '0xc0ffee.ca', template: '%s | 0xc0ffee.ca' },
  description: 'Anthony Li — computer science, projects, and the occasional devlog.',
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <Header />
        <main id="main">{children}</main>
        <PageTerminal />
        <Footer />
      </body>
    </html>
  );
}
