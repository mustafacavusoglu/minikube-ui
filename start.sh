#!/bin/bash

# Script'in bulunduğu dizini al
BASE_DIR="$(cd "$(dirname "$0")" && pwd)"

# Backend
cd "$BASE_DIR/backend" && npm run dev &
BACKEND_PID=$!

# Frontend
cd "$BASE_DIR/frontend" && npm run dev &
FRONTEND_PID=$!

echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"

wait $BACKEND_PID $FRONTEND_PID