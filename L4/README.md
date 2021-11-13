# Purpose
The purpose of this project is to get some experience in stress testing and inspect max perfomance of my customer node app.

# Install

To get up infra and app
```
    $ docker-compose build && docker-compose up -d
```

# Tests

## With simple redis cache

* `siege -c10 -t60s -i --file siege-urls.txt`
