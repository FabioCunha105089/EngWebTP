#!/bin/bash

mkdir -p ./data/backup/pfpics
docker cp web-server:/usr/src/app/public/pfpics/. ./data/backup/pfpics/
docker compose down
docker compose up --build -d
docker cp ./data/backup/pfpics/. web-server:/usr/src/app/public/pfpics/