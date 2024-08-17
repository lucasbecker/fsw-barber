import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { Card, CardContent } from './ui/card';

type BookingCardSummaryProps = {
  barbershopService: { name: string; price: string };
  barbershop?: { name: string };
  date: Date;
};

export function BookingCardSummary({
  barbershopService,
  barbershop,
  date,
}: BookingCardSummaryProps) {
  return (
    <Card className="rounded-xl">
      <CardContent className="flex flex-col gap-3 p-3">
        <div className="flex items-center justify-between gap-3">
          <h5 className="font-bold">{barbershopService.name}</h5>
          <span className="text-end text-sm font-bold">
            {barbershopService.price}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted-foreground">Data</span>
          <p className="text-end">
            {format(date, "d 'de' MMMM", { locale: ptBR })}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted-foreground">Horário</span>
          <p className="text-end">{format(date, 'HH:mm', { locale: ptBR })}</p>
        </div>

        {barbershop && (
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="text-muted-foreground">Barbearia</span>
            <p className="text-end">{barbershop.name}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
