import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import { db } from '@/lib/prisma';

import { Button } from '@/components/ui/button';

import { LoginDialog } from '@/components/login-dialog';
import { BookingCard } from '@/components/booking-card';

export default async function Bookings() {
  const session = await getServerSession(authOptions);

  const [nextBookings, oldBookings] = session
    ? await Promise.all([
        await db.booking.findMany({
          where: {
            userId: session.user.id,
            date: { gte: new Date() },
          },
          include: {
            barbershopService: {
              include: {
                barbershop: true,
              },
            },
          },
          orderBy: { date: 'asc' },
        }),
        await db.booking.findMany({
          where: { userId: session.user.id, date: { lt: new Date() } },
          include: {
            barbershopService: {
              include: {
                barbershop: true,
              },
            },
          },
          orderBy: { date: 'asc' },
        }),
      ])
    : [null, null];

  return (
    <main>
      <section>
        <h1 className="text-xl font-bold">Agendamentos</h1>

        {!session && (
          <>
            <p className="text-muted-foreground">
              Você precisa estar logado para ver os agendamentos.
            </p>

            <LoginDialog>
              <Button variant="outline" className="rounded-lg">
                Fazer login
              </Button>
            </LoginDialog>
          </>
        )}

        {session && !nextBookings?.length && !oldBookings?.length && (
          <p className="font-thin">Nenhum agendamento encontrado.</p>
        )}
      </section>

      {!!nextBookings?.length && (
        <section>
          <h2 className="heading">Próximos</h2>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {nextBookings.map((booking) => (
              <BookingCard key={booking.id} data={booking} />
            ))}
          </div>
        </section>
      )}

      {!!oldBookings?.length && (
        <section>
          <h2 className="heading">Finalizados</h2>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {oldBookings.map((booking) => (
              <BookingCard key={booking.id} data={booking} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
