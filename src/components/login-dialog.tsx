'use client';

import { PropsWithChildren } from 'react';
import { signIn } from 'next-auth/react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';

export function LoginDialog({ children }: PropsWithChildren) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-w-10/12 w-80 rounded-xl border-none">
        <DialogHeader>Faça login na plataforma</DialogHeader>

        <DialogDescription>
          Conecte-se usando sua conta do Google.
        </DialogDescription>

        <Button
          variant="outline"
          className="rounded-lg font-bold"
          onClick={() => signIn('google')}
        >
          Google
        </Button>
      </DialogContent>
    </Dialog>
  );
}
