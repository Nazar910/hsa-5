# Task
* test Read/Write perfomance of Beanstalk and Redis (AOF/RDB) as a queue

# Results

## Beanstalkd

### Write
```
$ JOB_COUNT=1000000 python beanstalk/write.py

--- 35.85149669647217 seconds ---

```
which means ~ 27894 RPS

### Read
```
$ JOB_COUNT=1000000 python beanstalk/read.py

--- 72.90144324302673 seconds ---

```
which means ~ 13717 RPS

## Redis AOF

### Write
```
$ JOB_COUNT=1000000 REDIS_PORT=7000 python redis/write.py

--- 67.21776103973389 seconds ---

```
which means ~ 14880 RPS

### Read
```
$ JOB_COUNT=1000000 REDIS_PORT=7000 python redis/read.py

--- 66.73979783058167 seconds ---

```
which means ~ 14992 RPS

## Redis RDB

### Write
```
$ JOB_COUNT=1000000 REDIS_PORT=7001 python redis/write.py

--- 61.47548747062683 seconds ---

```
which means ~ 16268 RPS

### Read
```
$ JOB_COUNT=1000000 REDIS_PORT=7001 python redis/read.py

--- 60.47982954978943 seconds ---

```
which means ~ 16537 RPS

As we can see `beanstalkd` almost x2 faster that Redis in writing data to the queue BUT `Redis` still manages to be faster on read from the queue.
