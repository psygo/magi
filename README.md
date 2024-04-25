# Magnus Index

## Services Used

- [Vercel](https://vercel.com) for handling deployment.
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) for handling the DB.
- [uploadthing](https://uploadthing.com) for image or file upload.
- [Drizzle](https://orm.drizzle.team) for ORM.
- [Clerk](https://clerk.com) for authentication.
- [PostHog](https://posthog.com) for analytics.
- [Sentry](https://sentry.io) for error monitoring.

## Dev

This project has been set up with the [`create-t3-app`](https://create.t3.gg/) script.

### Deployment

Besides pushing things to Vercel and setting up the environment variables, you will need to manually do:

```sh
pnpm run db:push
```

### Env

Locally, you can set things up with:

```env
#-----------------------------------------------------------
# 1. DB

POSTGRES_URL=postgresql://phili:password@localhost:5432/postgres?search_path=public

#-----------------------------------------------------------
# 2. Clerk

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

CLERK_WEBHOOKS_USER_EVENTS=

#-----------------------------------------------------------
```

### Using Ngrok for Local Development

Expose your local host to the web:

```sh
ngrok http http://localhost:3000
```
