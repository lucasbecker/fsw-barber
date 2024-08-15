import { BarbershopCard } from '@/components/barbershop-card';
import { Search } from '@/components/search';
import { db } from '@/lib/prisma';

type BarbershopsProps = {
  searchParams: {
    search?: string;
  };
};

export default async function Barbershops({ searchParams }: BarbershopsProps) {
  const barbershops = await db.barbershop.findMany({
    where: {
      OR: [
        {
          name: {
            contains: searchParams?.search,
            mode: 'insensitive',
          },
        },
        {
          services: {
            some: {
              name: {
                contains: searchParams?.search,
                mode: 'insensitive',
              },
            },
          },
        },
      ],
    },
    orderBy: { name: 'asc' },
  });

  return (
    <main>
      <section className="pb-0">
        <Search />
      </section>

      <section>
        <h3>
          {searchParams.search
            ? `Resultados para "${searchParams.search}"`
            : 'Todos os resultados'}
        </h3>

        <div className="grid grid-cols-2 gap-4">
          {barbershops.map((barbershop) => (
            <BarbershopCard key={barbershop.id} data={barbershop} />
          ))}
        </div>
      </section>
    </main>
  );
}
