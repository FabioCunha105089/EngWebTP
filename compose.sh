#!/bin/bash

# Start Docker Compose
docker-compose up --build -d

# Execute commands in MongoDB container
docker exec mongodb bash -c "mongoimport -d engWebTP2024 -c ruas ./data/ruas.json --jsonArray &&
                             mongoimport -d engWebTP2024 -c entidades ./data/entidades.json --jsonArray &&
                             mongoimport -d engWebTP2024 -c lugares ./data/lugares.json --jsonArray"
