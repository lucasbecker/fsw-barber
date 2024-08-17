'use client';

import { SmartphoneIcon } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';

type PhoneProps = {
  children: string;
};

export function Phone({ children }: PhoneProps) {
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(children);

      toast.success('Contato copiado com succeso!');
    } catch {
      toast.error('Não foi possível copiar o contato!');
    }
  }

  return (
    <div className="flex items-center gap-2">
      <SmartphoneIcon className="size-6" />

      <a href={`tel:${children}`} className="flex-1">
        {children}
      </a>

      <Button
        onClick={handleCopy}
        className="rounded-lg"
        variant="outline"
        size="sm"
      >
        Copiar
      </Button>
    </div>
  );
}
