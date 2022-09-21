# Environmental App API

## Install & Setup

1-Download the project and open in VScode, or any of your preferred IDEs.

2-You must have [nodeJS](https://nodejs.org/en/download/) installed.

3-Use the following command in order to install the project dependencies, and devDependencies

```bash
npm install
```

4-The project also uses Redis as a secondary database. You must download the Redis source file either for [Linux](https://redis.io/download/) based systems, or for [Windows](https://github.com/microsoftarchive/redis/releases/tag/win-3.0.504)

5-You can also use a GUI app for Redis. [Redis Commander](https://www.npmjs.com/package/redis-commander), or [AnotherRedisDesktopManager](https://github.com/qishibo/AnotherRedisDesktopManager)

6-Open a second command terminal and copy the following command to start the redis server

```bash
redis-server
```

## Scripts

**Generate Token**

This script allows us to generate secrets for the JWT tokens for Access, refresh, and resetPassword Tokens

```bash
npm run gen-tokens
```
**Start Build**

The script allows to start and automatically restart the server using nodemon

```bash
npm start
```

**Start Redis server**

The script allows to start redis server

```bash
npm run redis
```

**Start Mongo server**

The script allows to start mongodb server

```bash
npm run mongo
```

**Create docker image**

The script allows to create the docker image for the app

```bash
npm run docker-build
```

## Table of Contents

- [Config](https://github.com/FrancoisAouad/Eurisko-Code-Challenge-FrancoisAouad/tree/eurisko/config)


