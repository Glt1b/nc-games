# NC Games

NC Games is my first project made for learning purpose.

## Link to hosted version


## Dependencies

```js
  "dependencies": {
    "dotenv": "^16.0.3",
    "express": "^4.18.2",
    "i": "^0.3.7",
    "pg": "^8.7.3",
    "pg-format": "^1.0.4"
  },
  "devDependencies": {
    "husky": "^7.0.0",
    "jest": "^27.5.1",
    "jest-extended": "^2.0.0",
    "jest-sorted": "^1.0.14",
    "supertest": "^6.3.1"
  }
```
## Seeding and running tests

```js
  "scripts": {
    "setup-dbs": "psql -f ./db/setup.sql",
    "seed": "node ./db/seeds/run-seed.js",
    "test": "jest",
    "prepare": "husky install"
  },
```

## .env files

You will need to create two .env files for your project: .env.test and .env.development. Into each, add PGDATABASE=<database_name_here>, with the correct database name for that environment (see /db/setup.sql for the database names).

## Minimum version of Node and Postgres

Node  v18.9.0.
Postgres v14.5