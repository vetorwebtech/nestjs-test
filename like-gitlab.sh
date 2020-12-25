#!/usr/bin/env bash
npm run build

VERSION="3.0.2"
LATEST="latest"
FLOWER="flower1"

docker build -f docker/Dockerfile -t nessit/${FLOWER} .

docker tag nessit/${FLOWER}:${LATEST} nessit/${FLOWER}:${VERSION}
