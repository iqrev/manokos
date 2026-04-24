'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Bookmark, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/',         label: 'Beranda',  Icon: Home      },
  { href: '/cari',     label: 'Cari',     Icon: Search    },
  { href: '/simpan',   label: 'Simpan',   Icon: Bookmark  },
  { href: '/akun',     label: 'Akun',     Icon: User      },
];

export default function BottomNav() {
  const pathname = usePathname();

  // Don't show on auth pages and dashboards
  const hide = ['/login', '/daftar', '/owner', '/admin'].some(p => pathname.startsWith(p));
  if (hide) return null;

  return (
    <nav className="bottom-nav md:hidden" role="navigation" aria-label="Navigasi Utama">
      <div className="bottom-nav-inner">
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              id={`nav-${label.toLowerCase()}`}
              className={cn('bottom-nav-item', active && 'active')}
              aria-label={label}
              aria-current={active ? 'page' : undefined}
            >
              <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
