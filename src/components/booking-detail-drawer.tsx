'use client';

import Image from 'next/image';

import { PropsWithChildren, useState } from 'react';
import { isFuture } from 'date-fns';

import { Barbershop, BarbershopService, Booking } from '@prisma/client';

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Card, CardContent } from './ui/card';
import { Separator } from './ui/separator';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

import { BookingCancelDialog } from './booking-cancel-dialog';
import { BookingCardSummary } from './booking-summary-card';
import { Phone } from './phone';

type BookingDetailDrawerProps = PropsWithChildren & {
  data: Booking & {
    barbershopService: Omit<BarbershopService, 'price'> & {
      price: string;
      barbershop: Barbershop;
    };
  };
};

export function BookingDetailDrawer({
  children,
  data,
}: BookingDetailDrawerProps) {
  const [open, setOpen] = useState(false);

  const isConfirmed = isFuture(data.date);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>

      <SheetContent
        aria-describedby={undefined}
        className="flex flex-col justify-start gap-0 overflow-y-auto overflow-x-hidden p-0"
      >
        <SheetHeader className="px-5 py-6">
          <SheetTitle className="text-start">Informações da Reserva</SheetTitle>
        </SheetHeader>

        <Separator />

        <div className="flex flex-1 flex-col gap-6 px-5 py-6">
          <div className="relative flex aspect-video w-full items-end overflow-hidden rounded-lg px-3 py-5">
            <Image fill alt="Mapa" src="/map.png" className="object-cover" />

            <Card className="z-10 w-full">
              <CardContent className="flex items-center gap-3 px-5 py-3">
                <Avatar>
                  <AvatarImage
                    className="size-12"
                    src={data.barbershopService.barbershop.imageUrl}
                  />
                  <AvatarFallback>
                    {data.barbershopService.barbershop.name}
                  </AvatarFallback>
                </Avatar>

                <div className="overflow-hidden">
                  <h6 className="font-bold">
                    {data.barbershopService.barbershop.name}
                  </h6>

                  <address className="truncate text-xs not-italic">
                    {data.barbershopService.barbershop.address}
                  </address>
                </div>
              </CardContent>
            </Card>
          </div>

          <Badge
            className="w-fit"
            variant={isConfirmed ? 'secondary' : 'outline'}
          >
            {isConfirmed ? 'Confirmado' : 'Finalizado'}
          </Badge>

          <BookingCardSummary
            barbershopService={data.barbershopService}
            date={data.date}
          />

          <div className="flex flex-col gap-3">
            {data.barbershopService.barbershop.phones.map((phone, index) => (
              <Phone key={phone + '-' + index}>{phone}</Phone>
            ))}
          </div>
        </div>

        <SheetFooter className="flex-row gap-3 p-6">
          <SheetClose asChild>
            <Button variant="secondary" className="w-full rounded-lg">
              Voltar
            </Button>
          </SheetClose>

          {isConfirmed && (
            <BookingCancelDialog
              bookingId={data.id}
              onClose={() => setOpen(false)}
            >
              <Button variant="destructive" className="w-full rounded-lg">
                Cancelar Reserva
              </Button>
            </BookingCancelDialog>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
