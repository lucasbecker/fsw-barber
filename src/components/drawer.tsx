'use client';

import Link from 'next/link';
import Image from 'next/image';
import { PropsWithChildren } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { Button } from './ui/button';

export function Drawer({ children }: PropsWithChildren) {
  const { data } = useSession();

  async function handleLoginWithGoogle() {
    await signIn('google');
  }

  async function handleLogout() {
    await signOut();
  }

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
          {data?.user ? (
            <div className="flex items-center gap-3">
              <Avatar className="size-12 border-2 border-primary">
                <AvatarImage src={data.user.image ?? undefined} />
                <AvatarFallback>{data.user.name}</AvatarFallback>
              </Avatar>

              <div>
                <p className="font-bold">{data.user.name}</p>

                <span className="truncate text-sm text-muted-foreground">
                  {data.user.email}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-lg font-bold">Olá, faça seu login!</p>

              <Dialog>
                <DialogTrigger asChild>
                  <Button size="icon">
                    <LogInIcon className="size-5" />
                  </Button>
                </DialogTrigger>

                <DialogContent className="w-10/12 rounded-xl">
                  <DialogHeader>Faça login na plataforma</DialogHeader>

                  <DialogDescription className="text-center">
                    Conecte-se usando sua conta do Google.
                  </DialogDescription>

                  <Button className="font-bold" onClick={handleLoginWithGoogle}>
                    Google
                  </Button>
                </DialogContent>
              </Dialog>
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

          {data?.user && (
            <>
              <Separator />

              <Button
                onClick={handleLogout}
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
