#!/bin/bash

docker exec mongodb bash -c 'mongoexport --uri="mongodb://localhost:27017/engWebTP2024" --collection=ruas --jsonArray --out="./data/backup/ruas.json" &&
                             mongoexport --uri="mongodb://localhost:27017/engWebTP2024" --collection=inforuas --jsonArray --out="./data/backup/inforuas.json" &&
                             mongoexport --uri="mongodb://localhost:27017/engWebTP2024" --collection=entidades --jsonArray --out="./data/backup/entidades.json" &&
                             mongoexport --uri="mongodb://localhost:27017/engWebTP2024" --collection=sugestoes --jsonArray --out="./data/backup/sugestoes.json" &&
                             mongoexport --uri="mongodb://localhost:27017/engWebTP2024" --collection=users --jsonArray --out="./data/backup/users.json" &&
                             mongoexport --uri="mongodb://localhost:27017/engWebTP2024" --collection=lugares --jsonArray --out="./data/backup/lugares.json"'

mkdir -p ./data/backup/jsons
docker cp mongodb:/data/backup/. ./data/backup/jsons/
mkdir -p ./data/backup/pfpics
docker cp web-server:/usr/src/app/pfpics/. ./data/backup/pfpics/
mkdir -p ./data/backup/uploads
docker cp web-server:/usr/src/app/uploads/. ./data/backup/uploads/
mkdir -p ./data/backup/imagens
docker cp web-server:/usr/src/app/public/images/. ./data/backup/imagens/