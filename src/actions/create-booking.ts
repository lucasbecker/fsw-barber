'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/prisma';

type CreateBookingParams = {
  barbershopServiceId: string;
  date: Date;
};

export async function createBooking(params: CreateBookingParams) {
  const session = await getServerSession(authOptions);

  if (!session) throw new Error('Usuário não autenticado!');

  return await db.booking.create({
    data: {
      userId: session.user.id,
      ...params,
    },
  });
}
