'use server';

import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/prisma';

type DeleteBookingParams = {
  bookingId: string;
  pathname?: string;
};

export async function deleteBooking({
  bookingId,
  pathname = '/',
}: DeleteBookingParams) {
  const session = await getServerSession(authOptions);

  if (!session) throw new Error('Usuário não autenticado!');

  await db.booking.delete({
    where: {
      id: bookingId,
      userId: session.user.id,
    },
  });

  revalidatePath(pathname);
}
