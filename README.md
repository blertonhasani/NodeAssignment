# API-Assignment

Node js test assignment

## Setup

Use the package manager [npm](https://www.npmjs.com/get-npm/) to install the dependencies.

```bash
npm install
```

Copy paste .env.example to .env and replace variables.

Example

```bash
PORT=2999
MONGODB_URI=mongodb://db:27017/Api-Assignment
JWT_SECRET=abc12345z
```

## Start

Start the application

To start the application with Docker, you must have Docker running to start the application using this command::

```bash
docker compose up
```

To start without docker:

change on .env mongo uri to MONGODB_URI=mongodb://localhost:27017/Api-Assignment

```bash
npm run start
```

## Test

change on .env mongo uri to MONGODB_URI=mongodb://localhost:27017/Api-Assignment

make sure you build the files, command to build files is

```bash
npm run build
```

run the tests

```bash
npm run test
```

### Database

    For the Database, I used Mongo because for this assignment it is the simplest DB implementation. By simplest implementation, I mean that with only one Document can handle the approach of assignment.
