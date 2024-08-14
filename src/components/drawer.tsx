'use client';

import Link from 'next/link';
import Image from 'next/image';
import { PropsWithChildren, useState } from 'react';
import {
  CalendarIcon,
  HomeIcon,
  LogInIcon,
  LogOutIcon,
  ScissorsIcon,
} from 'lucide-react';

import { QUICK_SEARCH_OPTIONS } from '@/constants/quick-search';

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { Button } from './ui/button';

type DrawerProps = {} & PropsWithChildren;

export function Drawer({ children }: DrawerProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>

      <SheetContent
        aria-describedby={undefined}
        className="overflow-y-auto overflow-x-hidden"
      >
        <SheetHeader>
          <SheetTitle className="text-start">Menu</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-6 py-6">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Avatar className="size-12 border-2 border-primary">
                <AvatarImage src="https://github.com/lucasbecker.png" />
                <AvatarFallback>LB</AvatarFallback>
              </Avatar>

              <div>
                <p className="font-bold">Lucas Becker</p>

                <span className="truncate text-sm text-muted-foreground">
                  lucasbeckerfelisberto@gmail.com
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-lg">Olá, faça seu login!</p>

              <Button size="icon" onClick={() => setIsAuthenticated(true)}>
                <LogInIcon className="size-5" />
              </Button>
            </div>
          )}

          <Separator />

          <div className="flex flex-col gap-1">
            <SheetClose asChild>
              <Button
                asChild
                size="lg"
                variant="ghost"
                className="justify-start gap-2"
              >
                <Link href="/">
                  <HomeIcon className="size-5" />
                  Início
                </Link>
              </Button>
            </SheetClose>

            <Button className="justify-start gap-2" variant="ghost" size="lg">
              <CalendarIcon className="size-5" />
              Agendamentos
            </Button>

            <Button className="justify-start gap-2" variant="ghost" size="lg">
              <ScissorsIcon className="size-5" />
              Barbearias
            </Button>
          </div>

          <Separator />

          <div className="flex flex-col gap-1">
            {QUICK_SEARCH_OPTIONS.map((option) => (
              <Button
                key={option.title}
                className="justify-start gap-2"
                variant="ghost"
                size="lg"
              >
                <Image
                  src={option.imageUrl}
                  alt={option.title}
                  height={20}
                  width={20}
                />
                {option.title}
              </Button>
            ))}
          </div>

          {isAuthenticated && (
            <>
              <Separator />

              <Button
                onClick={() => setIsAuthenticated(false)}
                className="justify-start gap-2"
                variant="ghost"
                size="lg"
              >
                <LogOutIcon className="size-5" />
                Sair da conta
              </Button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
