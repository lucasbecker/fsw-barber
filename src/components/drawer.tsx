'use client';

import Image from 'next/image';
import Link from 'next/link';

import {
  CalendarIcon,
  HomeIcon,
  LogInIcon,
  LogOutIcon,
  ScissorsIcon,
} from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { PropsWithChildren } from 'react';

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

import { LoginDialog } from './login-dialog';

export function Drawer({ children }: PropsWithChildren) {
  const { data: session, status } = useSession();

  const isAuthenticated = status === 'authenticated';

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
                <AvatarImage src={session.user.image ?? undefined} />
                <AvatarFallback>{session.user.name}</AvatarFallback>
              </Avatar>

              <div>
                <p className="font-bold">{session.user.name}</p>

                <span className="truncate text-sm text-muted-foreground">
                  {session.user.email}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-lg font-bold">Olá, faça seu login!</p>

              <LoginDialog>
                <Button size="icon">
                  <LogInIcon className="size-5" />
                </Button>
              </LoginDialog>
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

            <SheetClose asChild>
              <Button
                asChild
                size="lg"
                variant="ghost"
                className="justify-start gap-2"
              >
                <Link href="/bookings">
                  <CalendarIcon className="size-5" />
                  Agendamentos
                </Link>
              </Button>
            </SheetClose>

            <SheetClose asChild>
              <Button
                asChild
                size="lg"
                variant="ghost"
                className="justify-start gap-2"
              >
                <Link href="/barbershops">
                  <ScissorsIcon className="size-5" />
                  Barbearias
                </Link>
              </Button>
            </SheetClose>
          </div>

          <Separator />

          <div className="flex flex-col gap-1">
            {QUICK_SEARCH_OPTIONS.map((option) => (
              <SheetClose asChild key={option.title}>
                <Button
                  asChild
                  size="lg"
                  variant="ghost"
                  className="justify-start gap-2"
                >
                  <Link href={`/barbershops?search=${option.title}`}>
                    <Image
                      src={option.imageUrl}
                      alt={option.title}
                      height={20}
                      width={20}
                    />
                    {option.title}
                  </Link>
                </Button>
              </SheetClose>
            ))}
          </div>

          {isAuthenticated && (
            <>
              <Separator />

              <Button
                onClick={() => signOut()}
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
