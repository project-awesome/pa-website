#!/usr/bin/env bash

echo Setting up environment variables for local testing

export DATABASE_URL=postgres://${USER}@localhost/postgres
