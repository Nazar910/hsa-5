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
