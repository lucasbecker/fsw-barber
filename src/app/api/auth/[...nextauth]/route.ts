import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import { Adapter } from 'next-auth/adapters';
import { PrismaAdapter } from '@auth/prisma-adapter';

import { db } from '@/lib/prisma';

const handler = NextAuth({
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
});

export { handler as GET, handler as POST };
