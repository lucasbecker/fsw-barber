import Link from 'next/link';
import Image from 'next/image';
import { StarIcon } from 'lucide-react';

import { Barbershop } from '@prisma/client';

import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

type BarbershopCardProps = {
  data: Barbershop;
};

export function BarbershopCard({ data }: BarbershopCardProps) {
  return (
    <Card className="min-w-44 rounded-2xl">
      <CardContent className="p-1">
        <div className="relative aspect-square w-full overflow-hidden rounded-xl">
          <Badge variant="secondary" className="absolute left-2 top-2 z-10">
            <StarIcon className="mr-1 size-3 fill-primary" /> 5,0
          </Badge>
          <Image
            className="object-cover"
            src={data.imageUrl}
            alt={data.name}
            quality={100}
            sizes="33vw"
            fill
          />
        </div>

        <div className="flex flex-col gap-3 p-2">
          <div>
            <h6 className="truncate font-semibold" title={data.name}>
              {data.name}
            </h6>

            <address
              className="truncate text-xs not-italic text-muted-foreground"
              title={data.address}
            >
              {data.address}
            </address>
          </div>

          <Button variant="secondary" className="rounded-lg" asChild>
            <Link href={`/barbershops/${data.id}`}>Reservar</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
