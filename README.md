# Simple Task Manager

This is just a simple task manager software (aka TODO App) as a small tech demo demonstrating Spring Boot 3.1
with PostgresSQL, Vanilla JavaScript using the fetch api and Bootstrap. 

## How to Get Started

The application is configured for the database specified in the accompanying docker-compose.yml file.
If you want to use a different database, you need to modify the
[application.properties](src/main/resources/application.properties) file.

## Starting the PostgreSQL database in a Docker container

To start the database, you can use either Docker Desktop or IntelliJ (Services), or navigate to the root directory of
the project on the command line:


```bash
$ docker compose up --detach
```

This command starts the database in the background. To check its status, use the following command:

```bash
$ docker ps --all
```

To stop the database, use the following command:

```bash
$ docker compose down
```

The container is configured to store the database data in a Docker volume, so the data will be retained when the
database is started again.

To view the volumes, use the following command:

```bash
$ docker volume ls
```

To delete the data volumes, use the following command:

```bash
$ docker volume rm task_manager_task_manager_db_data
```

## Starting the application

Now you can compile the Spring Boot application with:

```bash
$ ./mvnw clean install
```

If the database is available and configured, you can start the application with the following command:

```bash
$ ./mvnw spring-boot:run
```

## Building a docker container

To build a docker container of the app, you can use the spring-boot-maven plugin by running this command:

```bash
$ ./mvnw spring-boot:build-image
```

## Accessing Swagger-UI

You can test the complete functionality using the Swagger-UI, which is
available at <http://localhost:8080/swagger-ui.html>.
