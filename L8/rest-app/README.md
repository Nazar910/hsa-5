# Task

* Prepare Mysql db with 40m users
* Test select perfomance by date:
  * without index
  * with B-tree index
  * with HASH index
* try different options of `innodb_flush_log_at_trx_commit` param and monitor insert perfomance

# Prerequisits
* docker-compose

# Set up

```bash
  $ docker-compose up -d
```

This will start up mysql db, admin tool and rest-app (node.js app that servers GET /users request + contains seed logic)


# Results

## GET perfomance

### Without index

* siege -c5 -t60s http://localhost:3000/users\?date\='1996-10-09'
```
Transactions:		          10 hits
Availability:		      100.00 %
Elapsed time:		       59.12 secs
Data transferred:	        1.25 MB
Response time:		       20.24 secs
Transaction rate:	        0.17 trans/sec
Throughput:		        0.02 MB/sec
Concurrency:		        3.42
Successful transactions:          10
Failed transactions:	           0
Longest transaction:	       20.66
Shortest transaction:	       19.80
```

* siege -c10 -t60s http://localhost:3000/users\?date\='1996-10-09'
```
Transactions:		          10 hits
Availability:		      100.00 %
Elapsed time:		       59.91 secs
Data transferred:	        1.25 MB
Response time:		       29.38 secs
Transaction rate:	        0.17 trans/sec
Throughput:		        0.02 MB/sec
Concurrency:		        4.90
Successful transactions:          10
Failed transactions:	           0
Longest transaction:	       30.66
Shortest transaction:	       28.22
```

* siege -c25 -t60s http://localhost:3000/users\?date\='1996-10-09'
```
Transactions:		          10 hits
Availability:		      100.00 %
Elapsed time:		       59.90 secs
Data transferred:	        1.25 MB
Response time:		       31.40 secs
Transaction rate:	        0.17 trans/sec
Throughput:		        0.02 MB/sec
Concurrency:		        5.24
Successful transactions:          10
Failed transactions:	           0
Longest transaction:	       34.85
Shortest transaction:	       29.21
```

* siege -c50 -t60s http://localhost:3000/users\?date\='1996-10-09'
```
Transactions:		          10 hits
Availability:		      100.00 %
Elapsed time:		       59.84 secs
Data transferred:	        1.25 MB
Response time:		       40.46 secs
Transaction rate:	        0.17 trans/sec
Throughput:		        0.02 MB/sec
Concurrency:		        6.76
Successful transactions:          10
Failed transactions:	           0
Longest transaction:	       48.13
Shortest transaction:	        0.00
```


### With BTREE index

* siege -c5 -t60s http://localhost:3000/users\?date\='1996-10-09'
```
Transactions:		        6540 hits
Availability:		      100.00 %
Elapsed time:		       59.43 secs
Data transferred:	      819.55 MB
Response time:		        0.05 secs
Transaction rate:	      110.05 trans/sec
Throughput:		       13.79 MB/sec
Concurrency:		        4.99
Successful transactions:        6540
Failed transactions:	           0
Longest transaction:	        0.35
Shortest transaction:	        0.01
```

* siege -c10 -t60s http://localhost:3000/users\?date\='1996-10-09'
```
Transactions:		        6832 hits
Availability:		      100.00 %
Elapsed time:		       59.32 secs
Data transferred:	      856.14 MB
Response time:		        0.09 secs
Transaction rate:	      115.17 trans/sec
Throughput:		       14.43 MB/sec
Concurrency:		        9.98
Successful transactions:        6832
Failed transactions:	           0
Longest transaction:	        0.21
Shortest transaction:	        0.02
```

* siege -c25 -t60s http://localhost:3000/users\?date\='1996-10-09'
```
Transactions:		        7098 hits
Availability:		      100.00 %
Elapsed time:		       59.55 secs
Data transferred:	      889.48 MB
Response time:		        0.21 secs
Transaction rate:	      119.19 trans/sec
Throughput:		       14.94 MB/sec
Concurrency:		       24.93
Successful transactions:        7098
Failed transactions:	           0
Longest transaction:	        0.37
Shortest transaction:	        0.02
```

* siege -c50 -t60s http://localhost:3000/users\?date\='1996-10-09'
```
Transactions:		        6429 hits
Availability:		      100.00 %
Elapsed time:		       59.97 secs
Data transferred:	      805.64 MB
Response time:		        0.46 secs
Transaction rate:	      107.20 trans/sec
Throughput:		       13.43 MB/sec
Concurrency:		       49.82
Successful transactions:        6429
Failed transactions:	           0
Longest transaction:	        0.70
Shortest transaction:	        0.04
```
