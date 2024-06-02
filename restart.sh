#!/bin/bash

docker cp mongodb:/public/pfpics/. ./data/backup/pfpics/
docker compose down
docker compose up --build -d
docker cp ./data/backup/pfpics/. mongodb:/public/pfpics/