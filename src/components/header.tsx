import { MenuIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Logo } from './logo';

export function Header() {
  return (
    <header className="flex items-center justify-between border-b p-5">
      <h1 className="sr-only">FSW Barber</h1>

      <Logo height={20} width={120} />

      <Button variant="ghost" size="icon">
        <MenuIcon className="size-5" />
      </Button>
    </header>
  );
}
