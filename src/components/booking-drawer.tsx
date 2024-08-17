'use client';

import { PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { isPast, isToday, set } from 'date-fns';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ptBR } from 'date-fns/locale';

import { BarbershopService, Booking } from '@prisma/client';
import { createBooking } from '@/actions/create-booking';
import { getBookings } from '@/actions/get-bookings';

import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import { Separator } from './ui/separator';
import { Calendar } from './ui/calendar';
import { Skeleton } from './ui/skeleton';
import { Button } from './ui/button';

import { BookingCardSummary } from './booking-summary-card';
import { LoginDialog } from './login-dialog';

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

type GetAvailableTimesParams = { bookings: Array<Booking>; date: Date };

function getAvailableTimes({ bookings, date }: GetAvailableTimesParams) {
  return TIME_LIST.filter((time) => {
    const timeSplited = time.split(':');

    const hours = Number(timeSplited[0]);
    const minutes = Number(timeSplited[1]);

    const timeInPast = isPast(set(new Date(), { hours, minutes }));

    if (isToday(date) && timeInPast) return false;

    const hasBookingOnCurrentTime = bookings.some(
      (booking) =>
        booking.date.getHours() === hours &&
        booking.date.getMinutes() === minutes,
    );

    return !hasBookingOnCurrentTime;
  });
}

type BookingDrawerProps = PropsWithChildren & {
  data: Omit<BarbershopService, 'price'> & {
    price: string;
    barbershopName: string;
  };
};

export function BookingDrawer({ children, data }: BookingDrawerProps) {
  const session = useSession();
  const router = useRouter();

  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();

  const [bookings, setBookings] = useState<Array<Booking>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const isAuthenticated = session.status === 'authenticated';

  function handleSelectDate(date?: Date) {
    setSelectedTime(undefined);
    setSelectedDate(date);
  }

  function handleSelectTime(time?: string) {
    setSelectedTime(time);
  }

  async function handleCreateBooking() {
    if (!selectedDateAndTime) return;

    if (!isAuthenticated) {
      toast.warning('É necessário estar logado para fazer uma reserva!');
      return;
    }

    try {
      await createBooking({
        barbershopServiceId: data.id,
        date: selectedDateAndTime,
      });

      setOpen(false);

      toast.success('Reserva criada com sucesso!', {
        action: {
          label: 'Ver Agendamento',
          onClick: () => router.push('/bookings'),
        },
      });
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

        const [serviceBookings, userBookins] = await Promise.all([
          getBookings({
            date,
            barbershopServiceId: data.id,
          }),
          getBookings({
            date,
            userId: session.data?.user.id,
          }),
        ]);

        setBookings([...serviceBookings, ...userBookins]);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    if (selectedDate && session?.data) fetchBookings(selectedDate);
  }, [selectedDate, data.id, session?.data]);

  const selectedDateAndTime = useMemo(() => {
    if (!selectedDate || !selectedTime) return;

    const timeSplited = selectedTime.split(':');

    const hours = Number(timeSplited[0]);
    const minutes = Number(timeSplited[1]);

    const date = set(selectedDate, { hours, minutes });

    return date;
  }, [selectedDate, selectedTime]);

  const availableTimes = useMemo(
    () =>
      selectedDateAndTime &&
      getAvailableTimes({ bookings, date: selectedDateAndTime }),
    [bookings, selectedDateAndTime],
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>

      <SheetContent
        aria-describedby={undefined}
        className="flex flex-col justify-start gap-0 overflow-y-auto overflow-x-hidden p-0"
      >
        <SheetHeader className="px-5 py-6">
          <SheetTitle className="text-start">Fazer reserva</SheetTitle>
        </SheetHeader>

        <Separator />

        {isAuthenticated ? (
          <>
            <div className="px-5 py-6">
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

                  <div className="flex gap-3 overflow-x-auto px-5 py-6 [&::-webkit-scrollbar]:hidden">
                    {loading &&
                      Array.from({ length: 5 }).map((_, idx) => (
                        <Skeleton
                          key={`time-skeleton-${idx}`}
                          className="h-[36px] min-w-[63px]"
                        />
                      ))}

                    {!loading &&
                      availableTimes?.map((time) => (
                        <Button
                          key={time}
                          size="sm"
                          className="rounded-lg border"
                          variant={
                            time === selectedTime ? 'default' : 'outline'
                          }
                          onClick={() => handleSelectTime(time)}
                        >
                          {time}
                        </Button>
                      ))}

                    {!loading && !availableTimes?.length && (
                      <p>Nenhum horário disponível.</p>
                    )}
                  </div>
                </>
              )}

              {selectedDateAndTime && (
                <>
                  <Separator />

                  <div className="px-5 py-6">
                    <BookingCardSummary
                      barbershopService={data}
                      barbershop={{ name: data.barbershopName }}
                      date={selectedDateAndTime}
                    />
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 px-5 py-6">
            <p className="text-muted-foreground">
              Você precisa estar logado para fazer reservas.
            </p>
          </div>
        )}

        <SheetFooter className="p-6">
          {isAuthenticated ? (
            <Button
              disabled={!selectedDate || !selectedTime}
              onClick={handleCreateBooking}
              className="rounded-lg"
            >
              Confirmar
            </Button>
          ) : (
            <LoginDialog>
              <Button variant="outline" className="rounded-lg">
                Fazer login
              </Button>
            </LoginDialog>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
