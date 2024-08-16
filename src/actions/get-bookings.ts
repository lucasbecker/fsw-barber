'use server';

import { db } from '@/lib/prisma';
import { endOfDay, startOfDay } from 'date-fns';

type GetBookingsParams = {
  barbershopServiceId: string;
  date: Date;
};

export async function getBookings(params: GetBookingsParams) {
  return await db.booking.findMany({
    where: {
      barbershopServiceId: params.barbershopServiceId,
      date: {
        lte: endOfDay(params.date),
        gte: startOfDay(params.date),
      },
    },
  });
}
