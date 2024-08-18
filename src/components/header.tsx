'use client';

import Link from 'next/link';

import { usePathname } from 'next/navigation';
import { MenuIcon } from 'lucide-react';
import { Button } from './ui/button';

import { ThemeMode } from './theme-mode';
import { Drawer } from './drawer';
import { Logo } from './logo';

export function Header() {
  const pathname = usePathname();

  if (pathname.includes('barbershops/')) return;

  return (
    <header className="flex items-center justify-between gap-3 border-b p-5">
      <Link href="/" title="FSW Baber">
        <Logo height={20} width={120} />
      </Link>

      <div className="flex items-center justify-center gap-3">
        <ThemeMode />

        <Drawer>
          <Button size="icon" variant="ghost">
            <MenuIcon className="size-5" />
          </Button>
        </Drawer>
      </div>
    </header>
  );
}
