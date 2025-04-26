#!/usr/bin/env bash

cd "$(pwd)/sapcommunity/" \
  && ./save $(./list "$@")
