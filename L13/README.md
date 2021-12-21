# Tasks
* set up MySQL with slow query log
* configure ELK to work with MySQL slow query log
* configure Graylog2 to work with MySQL slow query log

# Set up

## MySQL
* turn on slow query log by adding following command to docker-compose:
```
...
image: mysql:8
command: --default-authentication-plugin=mysql_native_password --slow-query-log=1 --long-query-time=2 --slow-query-log-file=/var/log/mysql/mysql-slow.log
...
```


## ELK stack

Used ELK stack from this [repo](https://github.com/deviantony/docker-elk).
