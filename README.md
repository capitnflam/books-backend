# books-backend

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
