'use client';

import { usePathname } from 'next/navigation';
import { MenuIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Logo } from './logo';
import { Drawer } from './drawer';

export function Header() {
  const pathname = usePathname();

  if (pathname.includes('barbershops/')) return;

  return (
    <header className="flex items-center justify-between border-b p-5">
      <h1 className="sr-only">FSW Barber</h1>

      <Logo height={20} width={120} />

      <Drawer>
        <Button size="icon" variant="ghost">
          <MenuIcon className="size-5" />
        </Button>
      </Drawer>
    </header>
  );
}
