#!/bin/bash

for JSON_FILE in ./data/jsons/*.json; do
    if [[ -s "$JSON_FILE" && "$(cat "$JSON_FILE" | tr -d '[:space:]')" != "[]" ]]; then
        COLLECTION=$(basename "$JSON_FILE" .json)
        docker exec mongodb bash -c "mongoimport -d engWebTP2024 -c '$COLLECTION' '/data/$(basename "$JSON_FILE")' --jsonArray"
    else
        echo "Skipping empty or invalid file: $JSON_FILE"
    fi
done