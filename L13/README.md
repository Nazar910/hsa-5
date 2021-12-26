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

### Filebeat

* specify kibana url and elasticsearch as output
```
filebeat.config:
  modules:
    path: ${path.config}/modules.d/*.yml
    reload.enabled: false

filebeat.modules:
  - module: mysql
    slowlog:
      enabled: true
      var.paths: ["/opt/mysql/log/mysql-slow.log"]

setup.dashboard.enabled: true

setup.kibana.host: "http://kibana:5601"

output.elasticsearch:
  hosts: ["http://elasticsearch:9200"]
  username: "elastic"
  password: "changeme"
```
* set up kibana dashoboards:
```
    $ docker-compose exec filebeat filebeat setup -e
```

### MySQL data example

* discovery
![image](https://user-images.githubusercontent.com/19594637/147392435-cb5b5e63-9ec3-4e68-a310-15825b5dd99f.png)
* dashboard
![image](https://user-images.githubusercontent.com/19594637/147392427-8c7d19ee-f622-4dc6-9640-4dc0b685e873.png)


## Graylog2

Used following docker-compose from doc https://docs.graylog.org/docs/docker

### Filebeat

* used exact same filebeat config but as output specified Logstash
* create Beat input in Graylog on port 5044

### MySQl logs example

![image](https://user-images.githubusercontent.com/19594637/147406742-1ba4e8cf-ebb5-49cc-bc0b-959a1d3c756a.png)

