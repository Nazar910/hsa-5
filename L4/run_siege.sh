#!/bin/bash

siege -c200 -t30s -i --file siege-urls.txt
