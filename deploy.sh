#!/bin/bash
set -e
cd /opt/coshift
echo "→ Pulling..."; git pull
echo "→ Building..."; docker compose build
echo "→ Restarting..."; docker compose up -d
sleep 8
docker image prune -f
docker compose ps
curl -sI https://coshift.agency | head -3
echo "✓ Deployed at $(date)"
