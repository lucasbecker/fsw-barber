import GoogleProvider from 'next-auth/providers/google';

import { Adapter } from 'next-auth/adapters';
import { AuthOptions } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';

import { db } from '@/lib/prisma';

declare module 'next-auth' {
  interface User {
    id: string;
  }

  interface Session {
    user: User;
  }
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      session.user = {
        ...session.user,
        id: user.id,
      };

      return session;
    },
  },
};
