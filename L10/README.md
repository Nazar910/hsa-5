# Task
* test Read/Write perfomance of Beanstalk and Redis (AOF/RDB) as a queue

# Results

## Beanstalkd

### Write
```
$ JOB_COUNT=1000000 python beanstalk/write.py

--- 42.654876947402954 seconds ---

```
which means ~ 23474 RPS

### Read
```
$ JOB_COUNT=1000000 python beanstalk/read.py
--- 77.15081548690796 seconds ---
```
which means ~ 12970 RPS
