import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { ChevronLeftIcon, MapPinIcon, MenuIcon, StarIcon } from 'lucide-react';

import { BarbershopServiceCard } from '@/components/barbershop-service-card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Drawer } from '@/components/drawer';
import { Phone } from '@/components/phone';
import { db } from '@/lib/prisma';

type BarbershopProps = {
  params: { id: string };
};

export default async function Barbershop({ params: { id } }: BarbershopProps) {
  const barbershop = await db.barbershop.findUnique({
    where: { id },
    include: { services: true },
  });

  if (!barbershop) redirect('/');

  return (
    <main>
      <header className="relative aspect-video w-full">
        <Image
          fill
          alt={barbershop.name}
          src={barbershop.imageUrl}
          className="object-cover"
          priority
        />

        <Button
          asChild
          size="icon"
          variant="secondary"
          className="absolute left-4 top-4"
        >
          <Link href="..">
            <ChevronLeftIcon className="size-5" />
          </Link>
        </Button>

        <Drawer>
          <Button
            size="icon"
            variant="secondary"
            className="absolute right-4 top-4"
          >
            <MenuIcon className="size-5" />
          </Button>
        </Drawer>
      </header>

      <section>
        <h1 className="text-2xl font-bold">{barbershop.name}</h1>

        <div className="flex items-center gap-2">
          <MapPinIcon className="size-5 text-muted-foreground" />
          <address className="text-sm not-italic">{barbershop.address}</address>
        </div>

        <div className="flex items-center gap-2">
          <StarIcon className="size-5 text-muted-foreground" />
          <span className="text-sm not-italic">5,0 (889 avaliações)</span>
        </div>
      </section>

      <Separator />

      <section>
        <h3>Sobre nós</h3>

        <p className="text-justify text-sm">{barbershop.description}</p>
      </section>

      <Separator />

      <section>
        <h3>Serviços</h3>

        {barbershop.services.map((service) => (
          <BarbershopServiceCard key={service.id} data={service} />
        ))}
      </section>

      <Separator />

      <section>
        <h3>Contato</h3>

        {barbershop.phones.map((phone, index) => (
          <Phone key={phone + '-' + index}>{phone}</Phone>
        ))}
      </section>
    </main>
  );
}
