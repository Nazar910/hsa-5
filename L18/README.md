# Tasks
* test local mysql replication
* set up 3 docker images: mysql-m, mysql-s1 and mysql-s2

# Prerequisites
* ensure you *-conf.d directories have valid permissions
```
    $ chmod 555 mysql-m-conf.d
```
* Run all infra
```
    $ docker-compose up -d
```
* set up python env
```
    $ python3 -m venv venv
    $ source ./venv/bin/activate
    $ pip install -r requirements.txt
```

# Steps
* applied create_tables.sql
* launched python script to feed data
```
    $ python feed_data.py
```
* applied configure_master.sql to configure slave role on master and lock tables before backup
* did backup using adminer
* unlock tables on master
```
UNLOCK TABLES;
```
* created database on slave
```
CREATE DATABASE mydb;
```
* import dump
* applied configure_replica.sql (important to change MASTER_LOG_FILE and MAST_LOG_POS to data you've seen on `SHOW MASTER STATUS`)

# Results
