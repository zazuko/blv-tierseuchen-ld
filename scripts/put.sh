#!/bin/sh
## This is a workaround to put the cube metadata and generate the missing triples for the Cube JS API
curl -u ${STARDOG_USERNAME}:${STARDOG_PASSWORD_TEST} \
     --http1.1 \
     -X POST \
     -H Content-Type:text/turtle \
     -T data/dataset.ttl \
     -G https://stardog-test.cluster.ldbar.ch/lindas \
     --data-urlencode graph=https://linked.opendata.swiss/graph/blv/animalpest
#curl -n -X POST --data timeout=1000000 --data-urlencode query@sparql/rdf-data-cube-meta-hacklive.rq https://stardog-test.cluster.ldbar.ch/lindas/query
curl -u ${STARDOG_USERNAME}:${STARDOG_PASSWORD_TEST} -X POST --data timeout=1000000 --data-urlencode update@sparql/rdf-data-cube-meta-hacklive.rq https://stardog-test.cluster.ldbar.ch/lindas/update