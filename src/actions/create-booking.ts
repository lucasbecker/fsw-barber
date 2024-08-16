'use server';

import { db } from '@/lib/prisma';

type CreateBookingParams = {
  userId: string;
  barbershopServiceId: string;
  date: Date;
};

export async function createBooking(params: CreateBookingParams) {
  return await db.booking.create({
    data: {
      ...params,
    },
  });
}
