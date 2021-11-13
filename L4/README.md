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
![image](https://user-images.githubusercontent.com/19594637/141652542-f1a48f79-80bd-4cb7-9641-c4e08cabc4b9.png)
