#!/bin/bash

mkdir -p ./data/backup/pfpics
docker cp web-server:/usr/src/app/pfpics/. ./data/backup/pfpics/
mkdir -p ./data/backup/uploads
docker cp web-server:/usr/src/app/uploads/. ./data/backup/uploads/
docker compose down
docker compose up -d
docker cp ./data/backup/pfpics/. web-server:/usr/src/app/pfpics/
docker cp ./data/backup/uploads/. web-server:/usr/src/app/uploads/