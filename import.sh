#!/bin/bash

for JSON_FILE in ./data/*.json; do
    if [[ -s "$JSON_FILE" && "$(cat "$JSON_FILE" | tr -d '[:space:]')" != "[]" ]]; then
        COLLECTION=$(basename "$JSON_FILE" .json)
        docker exec mongodb bash -c "mongoimport --uri='mongodb://localhost:27017/engWebTP2024' --collection='$COLLECTION' --file='$JSON_FILE' --jsonArray"
    else
        echo "Skipping empty or invalid file: $JSON_FILE"
    fi
done