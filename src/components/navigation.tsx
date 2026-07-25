import Link from 'next/link';

const links = [
  { href: '/', label: 'Home' },
  { href: '/widget', label: 'Widget' },
  { href: '/leads', label: 'Leads' },
  { href: '/settings', label: 'Settings' },
  { href: '/health', label: 'Health' }
];

export function Navigation() {
  return (
    <header className="rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-4 shadow-sm backdrop-blur sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="text-lg font-semibold text-white">
          Widget Lead Platform
        </Link>
        <nav className="flex flex-wrap gap-2 text-sm text-slate-300">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full border border-slate-700 px-3 py-2 hover:border-cyan-400 hover:text-cyan-300"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
