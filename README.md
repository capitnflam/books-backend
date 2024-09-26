# books-backend

## Create db

```sql
CREATE USER booksserver WITH ENCRYPTED PASSWORD 'bookspassword';
CREATE DATABASE books;
GRANT ALL PRIVILEGES ON DATABASE books TO booksserver;
GRANT ALL PRIVILEGES ON SCHEMA public TO booksserver;
```

## Configure environment

In a `.env` file, put the following:

```
BOOKS_SERVER_DATABASE_URL="postgres://booksserver:bookspassword@localhost:5433/books"
BOOKS_SERVER_LOG_LEVEL="debug"
BOOKS_SERVER_LISTEN="127.0.0.1"
BOOKS_SERVER_PORT="3000"
```

## TypeORM commands

### Generate a migration

Using `<name>` as the migration name:

```sh
npm run typeorm migration:generate ./src/typeorm/migrations/<name>
```

> Example:
>
> ```sh
> npm run typeorm migration:generate ./src/typeorm/migrations/foobar
> ```

### Run migrations

```sh
npm run typeorm migration:run
```

### Show migrations

```sh
npm run typeorm migration:show
```

### Drop schema

```sh
npm run typeorm schema:drop
```

### Seed the database

```sh
npm run typeorm schema:drop
npm run typeorm migration:run
npm run typeorm:seed
```
