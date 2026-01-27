# README

## ISTL-Sports-Engine
The Italian Supreme Tennis League (ISTL, a fictitious organization) aims to unify and simplify the management of
racket-based tournaments, including, but not limited to, tennis, padel, table tennis, and similar sports.

### The monolith skeleton

Monolith is initialized using Rails generators, a common method for generating assumed directory structures and
boilerplate code. The following command initializes a new Ruby on Rails application in the current directory using
PostgreSQL as the database, explicitly eliminating the modern deployment and infrastructure tools introduced in Rails 8.
Using various skip flags, it bypasses the Kamal deployment tool, the Solid suite of database-backed background processes
and caching, the default GitHub Actions CI configurations, and the Thruster acceleration proxy, resulting in a
"traditional" and lightweight Rails configuration.

``` bash
rails new . --database=postgresql --skip-kamal --skip-solid --skip-ci --skip-thruster
```

### Run the monolith container

To run the monolith, you need to have Docker Engine installed. For demonstration purposes, everything is running
locally but the database that, as previously mentioned, is deployed on a virtual machine in AWS West Virginia. 

Backend and frontend merge, with the old, but not so bad, method of having both the presentation and business layers
within the same complete module. Each new feature is ideally designed to run in the same giant module. Replication means
replicating all functionality simultaneously, without separation. This lack of separation in terms of communication
processes is not confused with making the code deeply interconnected, where a change in one submodule breaks a submodule
responsible for other things. The code is developed by enforcing compliance with at least this "dependency rule", or 
"direction of dependency" for MVC applications:

- The model layer must not depend on the controller layer and must not know anything about how the model is exposed. The
    model only exposes methods (with which messages can be exchanged).
- The controller layer must not depend on the presentation layer and must not know anything about the frontend
- The presentation layer will depend on the controller layer and may use the interface exposed directly by the model

#### Start the monolith

``` bash
docker network create npm-shared
docker compose -f backend/docker-compose.app.yml up -d --build --remove-orphans
```

#### Stop the monolith

``` bash
docker compose -f backend/docker-compose.app.yml down --remove-orphans
docker network rm npm-shared
```

### Description

Monolith can be reached via http://localhost:3000.
There are already registered users and a few tournaments are already been played.

- Player 1:
  - username: mario@gmail.com
  - password: password

- Player 2:
  - username: donald@gmail.com
  - password: password

- Player 3:
  - username: alfonso@gmail.com
  - password: password

- Player 4:
  - username: gabriel@gmail.com
  - password: password

- Admin (only for admin panel, more info below):
  - username: admin@admin.com
  - password: Adm1ni$strat0r

- Organizer
  - username: org@org.com
  - password: password

- Referee (1):
  - username: ref1@ref.com
  - password: password

- Referee (2):
  - username: ref2@ref.com
  - password: password

The admin panel is accessible only to the admin user, which can be found at http://localhost:3000/admin. No sign-up is
required, as admin users are created through a special process (i.e., created by the machine owner via the Rails
console).