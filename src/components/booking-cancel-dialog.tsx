'use client';

import { PropsWithChildren } from 'react';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';

import { deleteBooking } from '@/actions/delete-booking';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';

type BookingCancelDialogProps = PropsWithChildren & {
  bookingId: string;
  onClose: () => void;
};

export function BookingCancelDialog({
  children,
  bookingId,
  onClose,
}: BookingCancelDialogProps) {
  const pathname = usePathname();

  async function handleCancelBooking() {
    try {
      await deleteBooking({ bookingId, pathname });

      toast.success('Reserva cancelada com sucesso!');

      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Erro ao cancelar a reserva!');
    }
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>

      <AlertDialogContent className="max-w-10/12 w-80 rounded-xl border-none">
        <AlertDialogHeader>
          <AlertDialogTitle>Cancelar Reserva</AlertDialogTitle>

          <AlertDialogDescription>
            Tem certeza que deseja cancelar esse agendamento?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex-row items-center gap-3">
          <AlertDialogCancel className="mt-0 w-full rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80">
            Voltar
          </AlertDialogCancel>

          <AlertDialogAction
            className="w-full rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={handleCancelBooking}
          >
            Confirmar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
