import Image from 'next/image';
import { SearchIcon } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

import { QUICK_SEARCH_OPTIONS } from '@/constants/quick-search';
import { BarbershopCard } from '@/components/barbershop-card';
import { db } from '@/lib/prisma';

export default async function Home() {
  const barbershops = await db.barbershop.findMany({});

  return (
    <main>
      <section className="gap-6 px-0">
        <div className="px-5">
          <h2 className="text-xl font-bold">Olá, Lucas!</h2>
          <span className="text-muted-foreground">Segunda, 5 de Agosto</span>
        </div>

        <form className="flex items-center gap-2 px-5">
          <Input placeholder="Search" />

          <Button size="icon" variant="secondary">
            <SearchIcon className="size-5" />
          </Button>
        </form>

        <div className="flex gap-3 overflow-x-auto px-5 [&::-webkit-scrollbar]:hidden">
          {QUICK_SEARCH_OPTIONS.map((option) => (
            <Button variant="secondary" key={option.title} className="gap-2">
              <Image
                src={option.imageUrl}
                alt={option.title}
                height={16}
                width={16}
              />

              {option.title}
            </Button>
          ))}
        </div>
      </section>

      <section>
        <div className="relative h-40 w-full overflow-hidden rounded-lg">
          <Image
            alt="Agende nos melhores com FSW Barber"
            src="/banner.png"
            fill
            className="object-cover"
          />
        </div>
      </section>

      <section>
        <h3 className="text-xs font-bold uppercase text-muted-foreground">
          Agendamentos
        </h3>

        <Card>
          <CardContent className="flex p-0">
            <div className="flex flex-1 flex-col gap-2 p-5">
              <Badge className="w-fit" variant="secondary">
                Confirmado
              </Badge>

              <h6 className="font-semibold">Corte de Cabelo</h6>

              <div className="flex items-center gap-2">
                <Avatar className="size-6">
                  <AvatarImage src="/banner.png" />
                  <AvatarFallback className="text-xs">BF</AvatarFallback>
                </Avatar>

                <span className="text-sm">Babearia FSW</span>
              </div>
            </div>

            <Separator orientation="vertical" className="h-auto" />

            <div className="flex flex-col items-center justify-center p-5">
              <span className="text-sm">Agosto</span>
              <span className="text-2xl">05</span>
              <span className="text-sm">09:45</span>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="px-0">
        <h3 className="px-5 text-xs font-bold uppercase text-muted-foreground">
          Recomendados
        </h3>

        <div className="flex gap-4 overflow-auto px-5 [&::-webkit-scrollbar]:hidden">
          {barbershops.map((barbershop) => (
            <BarbershopCard key={barbershop.id} data={barbershop} />
          ))}
        </div>
      </section>

      <section className="px-0">
        <h3 className="px-5 text-xs font-bold uppercase text-muted-foreground">
          Populares
        </h3>

        <div className="flex gap-4 overflow-auto px-5 [&::-webkit-scrollbar]:hidden">
          {barbershops.map((barbershop) => (
            <BarbershopCard key={barbershop.id} data={barbershop} />
          ))}
        </div>
      </section>
    </main>
  );
}
