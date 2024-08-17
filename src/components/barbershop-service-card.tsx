import Image from 'next/image';

import { BarbershopService } from '@prisma/client';

import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

import { BookingDrawer } from './booking-drawer';

type BarbershopServiceCardProps = {
  data: BarbershopService & { barbershopName: string };
};

export function BarbershopServiceCard({ data }: BarbershopServiceCardProps) {
  const price = data.price.toNumber().toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  return (
    <Card className="rounded-xl">
      <CardContent className="flex gap-3 p-3">
        <div className="relative aspect-square w-1/3 overflow-hidden rounded-lg">
          <Image
            fill
            quality={100}
            alt={data.name}
            src={data.imageUrl}
            sizes="33vw"
            className="object-cover"
          />
        </div>

        <div className="flex w-2/3 flex-col justify-between">
          <div className="flex flex-col gap-1">
            <h6 className="font-bold">{data.name}</h6>
            <p className="text-sm text-muted-foreground">{data.description}</p>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-bold">{price}</span>

            <BookingDrawer data={{ ...data, price }}>
              <Button variant="secondary" className="rounded-lg">
                Reservar
              </Button>
            </BookingDrawer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
