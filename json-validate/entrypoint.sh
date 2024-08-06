#!/bin/sh -l

python3 -u /validate.py --file "$1" --schema "$2"
