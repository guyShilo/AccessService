<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

Access Service built with [Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Running the app

```bash
# Docker
$ docker-compose up

# The service will be running on localhost:3000
```

# Routes

```
POST /
```

- Given an authenticated user request (which contains the userId) and a list of required permissions, generate a new api key for the user.

```json
# Example
{
    "userId": "5df66399592878d7d80dad38",
    "permissions": [
        "read",
        "write"
    ]
}
```

```bash
# With all the following requests please include Authorization Bearer in the request headers.
```

```
POST /authenticate
```

1. generate a new signed JWT token for the user with the pre-defined set of permissions
2. Update the "last usage" date of that token

```
DELETE /{:id}
```

- Given an authenticated user request and an API token, revoke the usage of that token.

```
GET /
```
- Given an authenticated user request, get all the tokens of that user in an obstructed form (showing only the last 4 chars, like a credit card) with their status and last recently used date.


Nest is [MIT licensed](LICENSE).
