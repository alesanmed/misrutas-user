## Description

One of the microservices from the **Mis Rutas**. This microservice is in charge of managing the authentication and authorization of users.

## Pre-requisites

This microservice needs a NATS and a PostgreSQL server runing. You can find the [compose files](http://google.es) needed for bringing those services up in [mis-rutas/infrastructre](https://github.com/alesanmed/misrutas-infrastructure) repository.

## Installation

```bash
$ npm install
```

## Loading sample data

There is a script prepared to load 5 sample users into the database with the following credentials:

* user1/password
* user2/password
* user3/password
* user4/password
* user5/password

For loading them you just have to run:

```shell
npm run seed
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## License

  Nest is [MIT licensed](LICENSE).
