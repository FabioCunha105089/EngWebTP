#!/bin/bash

# Start Docker Compose
docker compose up --build -d

# Execute commands in MongoDB container
docker exec mongodb bash -c "mongoimport -d engWebTP2024 -c ruas --file /data/ruas.json --jsonArray &&
                             mongoimport -d engWebTP2024 -c entidades --file /data/entidades.json --jsonArray &&
                             mongoimport -d engWebTP2024 -c lugares --file /data/lugares.json --jsonArray"
