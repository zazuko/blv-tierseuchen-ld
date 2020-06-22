#!/bin/bash

variables=()

[[ -n "$ENDPOINT" ]] && variables+=(--variable="endpoint=$ENDPOINT")
[[ -n "$STARDOG_USERNAME" ]] && variables+=(--variable="user=$STARDOG_USERNAME")
[[ -n "$STARDOG_PASSWORD" ]] && variables+=(--variable="password=$STARDOG_PASSWORD")

./node_modules/.bin/barnard59 run -v \
  --format text/turtle \
  "${variables[@]}" \
  --pipeline=urn:pipeline:tierseuchen-ld#$1 pipelines/blv-tierseuchen.ttl
