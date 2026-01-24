#!/bin/bash

case "$1" in
  start)

    # When this script is run with start, all services are started, starting with the nginx proxy manager. This starts
    # all the required services.

    echo "Starting services..."

    # If the requested network exists, avoid running the command as it will surely fail.
    docker network inspect npm-shared >/dev/null 2>&1 || docker network create npm-shared

    docker compose -p proxy -f docker-compose.npm.yml up -d
    docker compose -p api -f backend/docker-compose.backend.yml up -d --build --remove-orphans
    docker compose -p web -f frontend/docker-compose.frontend.yml up -d --build --remove-orphans

    echo "All services started"
    ;;

  stop)

    # When this script is run with atop, all services are stopped, ending with the nginx proxy manager.

    echo "Stopping services..."

    docker compose -p web -f frontend/docker-compose.frontend.yml down --remove-orphans
    docker compose -p api -f backend/docker-compose.backend.yml down --remove-orphans
    docker compose -p proxy -f docker-compose.npm.yml down

    # Remove the network, ignore the errors if it has already disappeared.
    docker network rm npm-shared >/dev/null 2>&1

    echo "All services removed"
    ;;

  restart)

    # Run this script first with the stop argument and then with the start argument, effectively restarting everything.

    $0 stop
    $0 start
    ;;

  *)

    echo "Usage: $0 {start|stop|restart}"
    exit 1
    ;;
esac