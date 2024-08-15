declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    DATABASE_PORT: string;
    DATABASE_HOST: string;
    DATABASE_NAME: string;
    DATABASE_USER: string;
    DATABASE_PASSWORD: string;

    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
  }
}
