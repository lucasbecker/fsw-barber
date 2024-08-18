import Image from 'next/image';
import Link from 'next/link';

import { getServerSession } from 'next-auth';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { authOptions } from '@/lib/auth';
import { db } from '@/lib/prisma';

import { Button } from '@/components/ui/button';

import { QUICK_SEARCH_OPTIONS } from '@/constants/quick-search';
import { BarbershopCard } from '@/components/barbershop-card';
import { BookingCard } from '@/components/booking-card';
import { Search } from '@/components/search';

export default async function Home() {
  const session = await getServerSession(authOptions);

  const barbershops = await db.barbershop.findMany({});

  const booking = session
    ? await db.booking.findFirst({
        where: {
          userId: session.user.id,
          date: { gte: new Date() },
        },
        include: { barbershopService: { include: { barbershop: true } } },
        orderBy: { date: 'asc' },
      })
    : null;

  return (
    <main>
      <section className="gap-6 px-0">
        <h1 className="sr-only">FSW Barber</h1>

        <div className="px-5">
          <h2 className="text-xl font-bold">
            Olá, {session?.user.name || 'Visitante'}!
          </h2>
          <span className="text-muted-foreground">
            {format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR })}
          </span>
        </div>

        <Search className="px-5" />

        <div className="flex gap-3 overflow-x-auto px-5 [&::-webkit-scrollbar]:hidden">
          {QUICK_SEARCH_OPTIONS.map((option) => (
            <Button
              asChild
              key={option.title}
              variant="secondary"
              className="gap-2"
            >
              <Link href={`/barbershops?search=${option.title}`}>
                <Image
                  src={option.imageUrl}
                  alt={option.title}
                  height={16}
                  width={16}
                />

                {option.title}
              </Link>
            </Button>
          ))}
        </div>
      </section>

      <section className="sm:hidden">
        <div className="relative h-40 w-full overflow-hidden rounded-lg">
          <Image
            alt="Agende nos melhores com FSW Barber"
            src="/banner.png"
            className="object-cover"
            priority
            fill
          />
        </div>
      </section>

      {booking && (
        <section>
          <h3 className="heading">Próximo Agendamento</h3>

          <BookingCard data={booking} />
        </section>
      )}

      <section className="px-0">
        <h3 className="heading px-5">Recomendados</h3>

        <div className="flex gap-4 overflow-auto px-5 [&::-webkit-scrollbar]:hidden">
          {barbershops.map((barbershop) => (
            <BarbershopCard key={barbershop.id} data={barbershop} />
          ))}
        </div>
      </section>

      <section className="px-0">
        <h3 className="heading px-5">Populares</h3>

        <div className="flex gap-4 overflow-auto px-5 [&::-webkit-scrollbar]:hidden">
          {barbershops.map((barbershop) => (
            <BarbershopCard key={barbershop.id} data={barbershop} />
          ))}
        </div>
      </section>
    </main>
  );
}
