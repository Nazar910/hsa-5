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

## without index

### explain analyze
`EXPLAIN ANALYZE SELECT * FROM users WHERE date = '1996-10-09' LIMIT 10;`
```
-> Limit: 10 row(s)  (cost=3971541.66 rows=10) (actual time=8277.882..8277.885 rows=10 loops=1)
    -> Filter: (users.`date` = DATE'1996-10-09')  (cost=3971541.66 rows=3811975) (actual time=8277.881..8277.883 rows=10 loops=1)
        -> Table scan on users  (cost=3971541.66 rows=38119745) (actual time=0.054..6652.940 rows=24175810 loops=1)
```

## siege (equality operator "=")

* `siege -c10 -t60s http://localhost:3000/users?op='='&date='1996-10-09'`
```
Transactions:		          54 hits
Availability:		      100.00 %
Elapsed time:		       59.09 secs
Data transferred:	        0.04 MB
Response time:		       10.12 secs
Transaction rate:	        0.91 trans/sec
Throughput:		        0.00 MB/sec
Concurrency:		        9.25
Successful transactions:          54
Failed transactions:	           0
Longest transaction:	       12.47
Shortest transaction:	        6.19
```

* `siege -c25 -t60s http://localhost:3000/users?op='='&date='1996-10-09'`
```
Transactions:		          52 hits
Availability:		      100.00 %
Elapsed time:		       59.98 secs
Data transferred:	        0.04 MB
Response time:		       21.76 secs
Transaction rate:	        0.87 trans/sec
Throughput:		        0.00 MB/sec
Concurrency:		       18.86
Successful transactions:          52
Failed transactions:	           0
Longest transaction:	       31.63
Shortest transaction:	        6.98
```

* `siege -c50 -t60s http://localhost:3000/users?op='='&date='1996-10-09'`
```
Transactions:		          45 hits
Availability:		      100.00 %
Elapsed time:		       59.62 secs
Data transferred:	        0.03 MB
Response time:		       35.50 secs
Transaction rate:	        0.75 trans/sec
Throughput:		        0.00 MB/sec
Concurrency:		       26.80
Successful transactions:          45
Failed transactions:	           0
Longest transaction:	       59.58
Shortest transaction:	       12.87
```

## siege (gt operator ">")

### explain analyze
`EXPLAIN ANALYZE SELECT * FROM users WHERE date > '1996-10-09' LIMIT 10;`
```
-> Limit: 10 row(s)  (cost=3971542.29 rows=10) (actual time=8553.109..8553.112 rows=10 loops=1)
    -> Filter: (users.`date` > DATE'1996-10-09')  (cost=3971542.29 rows=12705310) (actual time=8553.107..8553.109 rows=10 loops=1)
        -> Table scan on users  (cost=3971542.29 rows=38119745) (actual time=0.113..6796.712 rows=24177610 loops=1)
```

* `siege -c10 -t60s http://localhost:3000/users?op='>'&date='1996-10-09'`
```
Transactions:		          31 hits
Availability:		      100.00 %
Elapsed time:		       59.08 secs
Data transferred:	        0.02 MB
Response time:		       17.99 secs
Transaction rate:	        0.52 trans/sec
Throughput:		        0.00 MB/sec
Concurrency:		        9.44
Successful transactions:          31
Failed transactions:	           0
Longest transaction:	       37.50
Shortest transaction:	        7.46
```

* `siege -c25 -t60s http://localhost:3000/users?op='>'&date='1996-10-09'`
```
Transactions:		          52 hits
Availability:		      100.00 %
Elapsed time:		       59.52 secs
Data transferred:	        0.04 MB
Response time:		       21.22 secs
Transaction rate:	        0.87 trans/sec
Throughput:		        0.00 MB/sec
Concurrency:		       18.54
Successful transactions:          52
Failed transactions:	           0
Longest transaction:	       30.19
Shortest transaction:	        7.93
```

* `siege -c50 -t60s http://localhost:3000/users?op='>'&date='1996-10-09'`
```
Transactions:		          50 hits
Availability:		      100.00 %
Elapsed time:		       59.00 secs
Data transferred:	        0.03 MB
Response time:		       31.54 secs
Transaction rate:	        0.85 trans/sec
Throughput:		        0.00 MB/sec
Concurrency:		       26.73
Successful transactions:          50
Failed transactions:	           0
Longest transaction:	       57.61
Shortest transaction:	        6.52
```


## With BTREE index

## siege (equality operator "=")

### explain analyze
`EXPLAIN ANALYZE SELECT * FROM users WHERE date = '1996-10-09' LIMIT 10;`
```
-> Limit: 10 row(s)  (cost=1979.99 rows=10) (actual time=0.613..0.620 rows=10 loops=1)
    -> Index lookup on users using date_idx (date=DATE'1996-10-09')  (cost=1979.99 rows=1800) (actual time=0.609..0.615 rows=10 loops=1)
```


* `siege -c10 -t60s http://localhost:3000/users?op='='&date='1996-10-09'`
```
Transactions:		      134429 hits
Availability:		      100.00 %
Elapsed time:		       59.26 secs
Data transferred:	       93.72 MB
Response time:		        0.00 secs
Transaction rate:	     2268.46 trans/sec
Throughput:		        1.58 MB/sec
Concurrency:		        9.84
Successful transactions:      134429
Failed transactions:	           0
Longest transaction:	        0.04
Shortest transaction:	        0.00
```

* `siege -c25 -t60s http://localhost:3000/users?op='='&date='1996-10-09'`
```
Transactions:		      138020 hits
Availability:		      100.00 %
Elapsed time:		       59.23 secs
Data transferred:	       96.22 MB
Response time:		        0.01 secs
Transaction rate:	     2330.24 trans/sec
Throughput:		        1.62 MB/sec
Concurrency:		       24.83
Successful transactions:      138020
Failed transactions:	           0
Longest transaction:	        0.05
Shortest transaction:	        0.00
```

* `siege -c50 -t60s http://localhost:3000/users?op='='&date='1996-10-09'`
```
Transactions:		      136259 hits
Availability:		      100.00 %
Elapsed time:		       59.68 secs
Data transferred:	       94.99 MB
Response time:		        0.02 secs
Transaction rate:	     2283.16 trans/sec
Throughput:		        1.59 MB/sec
Concurrency:		       49.79
Successful transactions:      136259
Failed transactions:	           0
Longest transaction:	        0.06
Shortest transaction:	        0.01
```

## siege (gt operator ">")

### explain analyze
`EXPLAIN ANALYZE SELECT * FROM users WHERE date > '1996-10-09' LIMIT 10;`
```
-> Limit: 10 row(s)  (cost=21844361.23 rows=10) (actual time=33.677..33.705 rows=10 loops=1)
    -> Index range scan on users using date_idx, with index condition: (users.`date` > DATE'1996-10-09')  (cost=21844361.23 rows=19059872) (actual time=33.672..33.700 rows=10 loops=1)
```

* `siege -c10 -t60s http://localhost:3000/users?op='>'&date='1996-10-09'`
```
Transactions:		       10724 hits
Availability:		      100.00 %
Elapsed time:		       59.05 secs
Data transferred:	        7.48 MB
Response time:		        0.05 secs
Transaction rate:	      181.61 trans/sec
Throughput:		        0.13 MB/sec
Concurrency:		        9.97
Successful transactions:       10724
Failed transactions:	           0
Longest transaction:	        0.08
Shortest transaction:	        0.03
```

* `siege -c25 -t60s http://localhost:3000/users?op='>'&date='1996-10-09'`
```
Transactions:		       10440 hits
Availability:		      100.00 %
Elapsed time:		       59.52 secs
Data transferred:	        7.28 MB
Response time:		        0.14 secs
Transaction rate:	      175.40 trans/sec
Throughput:		        0.12 MB/sec
Concurrency:		       24.95
Successful transactions:       10440
Failed transactions:	           0
Longest transaction:	        0.20
Shortest transaction:	        0.03
```

* `siege -c50 -t60s http://localhost:3000/users?op='>'&date='1996-10-09'`
```
Transactions:		       10368 hits
Availability:		      100.00 %
Elapsed time:		       59.66 secs
Data transferred:	        7.23 MB
Response time:		        0.29 secs
Transaction rate:	      173.78 trans/sec
Throughput:		        0.12 MB/sec
Concurrency:		       49.85
Successful transactions:       10368
Failed transactions:	           0
Longest transaction:	        0.39
Shortest transaction:	        0.06
```

## With HASH index

## siege (equality operator "=")

### explain analyze
`EXPLAIN ANALYZE SELECT * FROM users WHERE date = '1996-10-09' LIMIT 10;`
```
-> Limit: 10 row(s)  (cost=1979.99 rows=10) (actual time=0.403..0.409 rows=10 loops=1)
    -> Index lookup on users using date_idx (date=DATE'1996-10-09')  (cost=1979.99 rows=1800) (actual time=0.400..0.405 rows=10 loops=1)
```


* `siege -c10 -t60s http://localhost:3000/users?op='='&date='1996-10-09'`
```
Transactions:		      130402 hits
Availability:		      100.00 %
Elapsed time:		       59.61 secs
Data transferred:	       90.91 MB
Response time:		        0.00 secs
Transaction rate:	     2187.59 trans/sec
Throughput:		        1.53 MB/sec
Concurrency:		        9.84
Successful transactions:      130402
Failed transactions:	           0
Longest transaction:	        0.02
Shortest transaction:	        0.00
```

* `siege -c25 -t60s http://localhost:3000/users?op='='&date='1996-10-09'`
```
Transactions:		      135523 hits
Availability:		      100.00 %
Elapsed time:		       59.08 secs
Data transferred:	       94.48 MB
Response time:		        0.01 secs
Transaction rate:	     2293.89 trans/sec
Throughput:		        1.60 MB/sec
Concurrency:		       24.83
Successful transactions:      135523
Failed transactions:	           0
Longest transaction:	        0.04
Shortest transaction:	        0.00
```

* `siege -c50 -t60s http://localhost:3000/users?op='='&date='1996-10-09'`
```
Transactions:		      135858 hits
Availability:		      100.00 %
Elapsed time:		       59.07 secs
Data transferred:	       94.71 MB
Response time:		        0.02 secs
Transaction rate:	     2299.95 trans/sec
Throughput:		        1.60 MB/sec
Concurrency:		       49.77
Successful transactions:      135858
Failed transactions:	           0
Longest transaction:	        0.06
Shortest transaction:	        0.01
```

## siege (gt operator ">")

### explain analyze
`EXPLAIN ANALYZE SELECT * FROM users WHERE date > '1996-10-09' LIMIT 10;`
```
-> Limit: 10 row(s)  (cost=21844361.23 rows=10) (actual time=34.129..34.150 rows=10 loops=1)
    -> Index range scan on users using date_idx, with index condition: (users.`date` > DATE'1996-10-09')  (cost=21844361.23 rows=19059872) (actual time=34.121..34.141 rows=10 loops=1)
```

* `siege -c10 -t60s http://localhost:3000/users?op='>'&date='1996-10-09'`
```
Transactions:		       10445 hits
Availability:		      100.00 %
Elapsed time:		       59.54 secs
Data transferred:	        7.28 MB
Response time:		        0.06 secs
Transaction rate:	      175.43 trans/sec
Throughput:		        0.12 MB/sec
Concurrency:		        9.98
Successful transactions:       10445
Failed transactions:	           0
Longest transaction:	        0.10
Shortest transaction:	        0.03
```

* `siege -c25 -t60s http://localhost:3000/users?op='>'&date='1996-10-09'`
```
Transactions:		       10473 hits
Availability:		      100.00 %
Elapsed time:		       59.04 secs
Data transferred:	        7.30 MB
Response time:		        0.14 secs
Transaction rate:	      177.39 trans/sec
Throughput:		        0.12 MB/sec
Concurrency:		       24.95
Successful transactions:       10473
Failed transactions:	           0
Longest transaction:	        0.22
Shortest transaction:	        0.04
```

* `siege -c50 -t60s http://localhost:3000/users?op='>'&date='1996-10-09'`
```
Transactions:		       10435 hits
Availability:		      100.00 %
Elapsed time:		       59.70 secs
Data transferred:	        7.27 MB
Response time:		        0.29 secs
Transaction rate:	      174.79 trans/sec
Throughput:		        0.12 MB/sec
Concurrency:		       49.86
Successful transactions:       10435
Failed transactions:	           0
Longest transaction:	        0.35
Shortest transaction:	        0.04
```
