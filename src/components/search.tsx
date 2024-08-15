'use client';

import { SearchIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from './ui/button';
import { Input } from './ui/input';
import { cn } from '@/lib/utils';

type SearchProps = {
  className?: string;
};

export function Search({ className }: SearchProps) {
  const { push } = useRouter();

  function handleSubmit(data: FormData) {
    const search = data.get('search');

    push(search ? `/barbershops?search=${search.toString()}` : '/barbershops');
  }

  return (
    <form
      className={cn('flex items-center gap-2', className)}
      action={handleSubmit}
    >
      <Input placeholder="Buscar" name="search" />

      <Button size="icon" variant="secondary" type="submit">
        <SearchIcon className="size-5" />
      </Button>
    </form>
  );
}
