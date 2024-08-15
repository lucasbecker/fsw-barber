'use client';

import Link from 'next/link';

import { usePathname } from 'next/navigation';
import { MenuIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Drawer } from './drawer';
import { Logo } from './logo';

export function Header() {
  const pathname = usePathname();

  if (pathname.includes('barbershops/')) return;

  return (
    <header className="flex items-center justify-between border-b p-5">
      <h1 className="sr-only">FSW Barber</h1>

      <Link href="/" title="FSW Baber">
        <Logo height={20} width={120} />
      </Link>

      <Drawer>
        <Button size="icon" variant="ghost">
          <MenuIcon className="size-5" />
        </Button>
      </Drawer>
    </header>
  );
}
