'use server';

import { endOfDay, startOfDay } from 'date-fns';
import { db } from '@/lib/prisma';

type GetBookingsParams = {
  barbershopServiceId?: string;
  userId?: string;
  date: Date;
};

export async function getBookings(params: GetBookingsParams) {
  return await db.booking.findMany({
    where: {
      barbershopServiceId: params.barbershopServiceId,
      userId: params.userId,
      date: {
        lte: endOfDay(params.date),
        gte: startOfDay(params.date),
      },
    },
  });
}
