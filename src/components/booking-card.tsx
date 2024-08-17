import { format, isFuture } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { Prisma } from '@prisma/client';

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Card, CardContent } from './ui/card';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';

import { BookingDetailDrawer } from './booking-detail-drawer';

type BookingCardProps = {
  data: Prisma.BookingGetPayload<{
    include: { barbershopService: { include: { barbershop: true } } };
  }>;
};

export function BookingCard({ data }: BookingCardProps) {
  const isConfirmed = isFuture(data.date);

  const price = data.barbershopService.price
    .toNumber()
    .toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  return (
    <BookingDetailDrawer
      data={{
        ...data,
        barbershopService: { ...data.barbershopService, price },
      }}
    >
      <Card className="cursor-pointer">
        <CardContent className="flex p-0">
          <div className="flex flex-1 flex-col gap-2 p-5">
            <Badge
              className="w-fit"
              variant={isConfirmed ? 'secondary' : 'outline'}
            >
              {isConfirmed ? 'Confirmado' : 'Finalizado'}
            </Badge>

            <h6 className="font-semibold">{data.barbershopService.name}</h6>

            <div className="flex items-center gap-2">
              <Avatar className="size-6">
                <AvatarImage src={data.barbershopService.barbershop.imageUrl} />

                <AvatarFallback className="text-xs">
                  {data.barbershopService.barbershop.name}
                </AvatarFallback>
              </Avatar>

              <span className="text-sm">
                {data.barbershopService.barbershop.name}
              </span>
            </div>
          </div>

          <Separator orientation="vertical" className="h-auto" />

          <div className="flex flex-col items-center justify-center p-5">
            <span className="text-sm capitalize">
              {format(data.date, 'MMMM', { locale: ptBR })}
            </span>
            <span className="text-2xl">
              {format(data.date, 'dd', { locale: ptBR })}
            </span>
            <span className="text-sm">
              {format(data.date, 'HH:mm', { locale: ptBR })}
            </span>
          </div>
        </CardContent>
      </Card>
    </BookingDetailDrawer>
  );
}
