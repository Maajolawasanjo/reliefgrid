#!/usr/bin/env bash
set -e
echo "Initializing ReliefGrid Development Environment..."
npm install
pip install poetry
poetry install
echo "ReliefGrid setup complete!"
