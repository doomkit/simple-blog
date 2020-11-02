# Simple blog

Minimalistic blog inspired by [surrenderat20.net](https://www.surrenderat20.net/).

## Development

**Documentations for used libraries:**

- [MIKRO-ORM docs](https://mikro-orm.io/docs/installation/) – TypeScript ORM for Node.js

**Links for development:**

- [PGWeb Postgress client](http://localhost:8081/)
- [GraphQL playground](http://localhost:3000/graphql)

### DB configuration

To start database using docker you need to create two config files:

**.env.postgres**  

```
POSTGRES_PASSWORD=${PASSWORD}
POSTGRES_USER=${USER}
POSTGRES_DB=${DB_NAME}
POSTGRES_PORT=${PORT_NUMBER}
```

**.env.pgweb**

```
DATABASE_URL=postgresql://[user[:password]@][netloc][:port][,...][/dbname][?param1=value1&...]
```

Replace keys with your values from `.env.postgres` file.  
For example: `DATABASE_URL=postgres://postgres:postgres@postgres:5432/postgres?sslmode=disable`.

After creating those files, start DB:

- start DB: `docker-compose up -d` (remove `-d` flag if you want to see logs)
- stop DB: `docker-compose down`
