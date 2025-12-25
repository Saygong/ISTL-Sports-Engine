# README

## ISTL-Sports-Engine
The Italian Supreme Tennis League (ISTL, a fictitious organization) aims to unify and simplify the management of
racket-based tournaments, including, but not limited to, tennis, padel, table tennis, and similar sports.

## Dependencies management
Dependencies are managed via Gemfile and Gemfile.lock, conveniently stored in a shared repository. By sharing
Gemfile.lock, all developers share the same libraries, all with the same version. This also avoids inconsistencies
between development and production environments.

## Create Rails structure
This command initializes a new Ruby on Rails application in the current directory using PostgreSQL as the database,
explicitly eliminating the modern deployment and infrastructure tools introduced in Rails 8. Using various skip flags,
it bypasses the Kamal deployment tool, the Solid suite of database-backed background processes and caching, the default
GitHub Actions CI configurations, and the Thruster acceleration proxy, resulting in a lightweight "traditional" Rails
setup.

``` bash
rails new . --database=postgresql --skip-kamal --skip-solid --skip-ci --skip-thruster
```

## Database management
Communication with the database is intended to be as simple as possible. In most cases, the only thing to do is to set
up the database configuration file, `config/database.yml`, and install the gem to start communicating with the database.

### Database creation
Rails offers a set of commands to easily prepare the database needed for the backend application.

``` bash
rails db:create  # Create an empty database
rails db:migrate # Migrates the database by running all new (not yet run) migrations
```

Or run `rails db:prepare`:

``` bash
rails db:prepare # https://guides.rubyonrails.org/active_record_migrations.html#preparing-the-database
```

### Database deletion
If you want to delete the database and start from scratch:

``` bash
rails db:drop # Delete the database
```

### Migrations
To create, update, or delete tables for your schema, Rails offers the migrations approach. Using a DSL it is possible to
easily define all the entities needed to correctly define the required schema.

### Rubocop
... explain some metrics, rails and conventions, look also at gems

### Authentication

``` bash
rails g devise:install
rails g devise_token_auth:install User auth
```

... token auth by defualt, but opting out for monolith

### Model annotations
...

## Deployment instructions
...
