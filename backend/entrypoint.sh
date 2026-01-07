#!/bin/bash

# This command will create the database, load the schema, and initialize it with the seed data - if any.
# This task operates idempotently, so it can safely be called several times, but it will only perform the necessary
# tasks once.
bundle exec rails db:prepare
bundle exec rails db:migrate
# Start the Rails server, binding it to all network interfaces (0.0.0.0).
# It is then accessible from outside the container on the specified port.
bundle exec rails s -b 0.0.0.0 -p "$RAILS_PORT"