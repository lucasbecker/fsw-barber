'use client';

import { PropsWithChildren, useEffect, useState } from 'react';
import { format, set } from 'date-fns';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { id, ptBR } from 'date-fns/locale';

import { BarbershopService, Booking } from '@prisma/client';
import { createBooking } from '@/actions/create-booking';
import { getBookings } from '@/actions/get-bookings';

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import { Card, CardContent } from './ui/card';
import { Separator } from './ui/separator';
import { Calendar } from './ui/calendar';
import { Skeleton } from './ui/skeleton';
import { Button } from './ui/button';

const TIME_LIST = [
  '08:00',
  '08:30',
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
];

function getAvailableTimes(bookings: Array<Booking>) {
  return TIME_LIST.filter((time) => {
    const timeSplited = time.split(':');

    const hours = Number(timeSplited[0]);
    const minutes = Number(timeSplited[1]);

    const hasBookingOnCurrentTime = bookings.some(
      (booking) =>
        booking.date.getHours() === hours &&
        booking.date.getMinutes() === minutes,
    );

    return !hasBookingOnCurrentTime;
  });
}

type DrawerService = PropsWithChildren & {
  data: Omit<BarbershopService, 'price'> & {
    price: string;
    barbershopName: string;
  };
};

export function DrawerBooking({ children, data }: DrawerService) {
  const { data: authData } = useSession();

  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();

  const [loading, setLoading] = useState<boolean>(false);
  const [bookings, setBookings] = useState<Array<Booking>>([]);

  function handleSelectDate(date?: Date) {
    setSelectedTime(undefined);
    setSelectedDate(date);
  }

  function handleSelectTime(time?: string) {
    setSelectedTime(time);
  }

  async function handleCreateBooking() {
    if (!selectedDate || !selectedTime) return;

    if (!authData?.user) {
      toast.warning('É necessário estar logado para fazer uma reserva!');
      return;
    }

    const timeSplited = selectedTime.split(':');

    const hours = Number(timeSplited[0]);
    const minutes = Number(timeSplited[1]);

    const date = set(selectedDate, { hours, minutes });

    try {
      await createBooking({
        barbershopServiceId: data.id,
        userId: authData.user.id,
        date,
      });

      toast.success('Reserva criada com sucesso!');
    } catch (error) {
      console.log(error);
      toast.error('Erro ao criar reserva!');
    } finally {
      setSelectedDate(undefined);
      setSelectedTime(undefined);
    }
  }

  useEffect(() => {
    async function fetchBookings(date: Date) {
      try {
        setLoading(true);

        const bkngs = await getBookings({ date, barbershopServiceId: data.id });

        setBookings(bkngs);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    if (selectedDate) fetchBookings(selectedDate);
  }, [selectedDate, data.id]);

  const availableTimes = getAvailableTimes(bookings);

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>

      <SheetContent
        aria-describedby={undefined}
        className="flex flex-col justify-start overflow-y-auto overflow-x-hidden p-0"
      >
        <SheetHeader className="p-6">
          <SheetTitle className="text-start">Fazer reserva</SheetTitle>
        </SheetHeader>

        <Separator />

        <div className="p-6">
          <Calendar
            mode="single"
            className="p-0"
            locale={ptBR}
            fromDate={new Date()}
            selected={selectedDate}
            onSelect={handleSelectDate}
            styles={{
              head_cell: {
                width: '100%',
                textTransform: 'capitalize',
              },
              cell: {
                width: '100%',
              },
              button: {
                width: '100%',
              },
              nav_button_previous: {
                width: '32px',
                height: '32px',
              },
              nav_button_next: {
                width: '32px',
                height: '32px',
              },
              caption: { textTransform: 'capitalize' },
            }}
          />
        </div>

        <div className="flex-1">
          {selectedDate && (
            <>
              <Separator />

              <div className="flex gap-3 overflow-x-auto p-6 [&::-webkit-scrollbar]:hidden">
                {loading &&
                  Array.from({ length: 5 }).map((_, idx) => (
                    <Skeleton
                      key={`time-skeleton-${idx}`}
                      className="h-[36px] min-w-[63px]"
                    />
                  ))}

                {!loading &&
                  availableTimes.map((time) => (
                    <Button
                      key={time}
                      size="sm"
                      className="border"
                      variant={time === selectedTime ? 'default' : 'outline'}
                      onClick={() => handleSelectTime(time)}
                    >
                      {time}
                    </Button>
                  ))}
              </div>
            </>
          )}

          {selectedDate && selectedTime && (
            <>
              <Separator />

              <div className="p-6">
                <Card className="p-0">
                  <CardContent className="flex flex-col gap-3 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <h6 className="font-bold">{data.name}</h6>
                      <span className="text-end text-sm font-bold">
                        {data.price}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-muted-foreground">Data</span>
                      <p className="text-end">
                        {format(selectedDate, "d 'de' MMMM", { locale: ptBR })}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-muted-foreground">Horário</span>
                      <p className="text-end">{selectedTime}</p>
                    </div>

                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-muted-foreground">Barbearia</span>
                      <p className="text-end">{data.barbershopName}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>

        <SheetFooter className="p-6">
          <SheetClose asChild>
            <Button
              disabled={!selectedDate || !selectedTime}
              onClick={handleCreateBooking}
            >
              Confirmar
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
