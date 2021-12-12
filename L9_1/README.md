# Task
* set up primary-replica redis configuration
* test different eviction policies
* implement probabilistic cache refresh ([Cache stampede problem](https://cseweb.ucsd.edu//~avattani/papers/cache_stampede.pdf))

## Redis primary-secondary config

This was achieved by using redis `replicaof` config option:
```
replicaof redis-primary 6379

masterauth foobared
```

In case of succesfull start we'll see something similar in the logs of primary:
```
redis-primary_1    | 1:M 12 Dec 2021 07:08:04.288 * Ready to accept connections
redis-primary_1    | 1:M 12 Dec 2021 07:08:04.759 * Replica 172.27.0.3:6379 asks for synchronization
redis-primary_1    | 1:M 12 Dec 2021 07:08:04.759 * Full resync requested by replica 172.27.0.3:6379
redis-primary_1    | 1:M 12 Dec 2021 07:08:04.759 * Replication backlog created, my new replication IDs are 'a90c2d971fea90524af99a2a94a4b794116602c8' and '0000000000000000000000000000000000000000'
redis-primary_1    | 1:M 12 Dec 2021 07:08:04.759 * Starting BGSAVE for SYNC with target: disk
redis-primary_1    | 1:M 12 Dec 2021 07:08:04.759 * Background saving started by pid 36
redis-primary_1    | 36:C 12 Dec 2021 07:08:04.765 * DB saved on disk
redis-primary_1    | 36:C 12 Dec 2021 07:08:04.765 * RDB: 0 MB of memory used by copy-on-write
redis-primary_1    | 1:M 12 Dec 2021 07:08:04.791 * Background saving terminated with success
redis-primary_1    | 1:M 12 Dec 2021 07:08:04.792 * Synchronization with replica 172.27.0.3:6379 succeeded
redis-primary_1    | 1:M 12 Dec 2021 07:09:16.341 * 10000 changes in 60 seconds. Saving...
redis-primary_1    | 1:M 12 Dec 2021 07:09:16.342 * Background saving started by pid 37
redis-primary_1    | 37:C 12 Dec 2021 07:09:16.350 * DB saved on disk
redis-primary_1    | 37:C 12 Dec 2021 07:09:16.350 * RDB: 0 MB of memory used by copy-on-write
redis-primary_1    | 1:M 12 Dec 2021 07:09:16.442 * Background saving terminated with success

```
and secondary
```
redis-secondary_1  | 1:S 12 Dec 2021 07:08:04.757 * Ready to accept connections
redis-secondary_1  | 1:S 12 Dec 2021 07:08:04.758 * Connecting to MASTER redis-primary:6379
redis-secondary_1  | 1:S 12 Dec 2021 07:08:04.759 * MASTER <-> REPLICA sync started
redis-secondary_1  | 1:S 12 Dec 2021 07:08:04.759 * Non blocking connect for SYNC fired the event.
redis-secondary_1  | 1:S 12 Dec 2021 07:08:04.759 * Master replied to PING, replication can continue...
redis-secondary_1  | 1:S 12 Dec 2021 07:08:04.759 * Partial resynchronization not possible (no cached master)
redis-secondary_1  | 1:S 12 Dec 2021 07:08:04.759 * Full resync from master: a90c2d971fea90524af99a2a94a4b794116602c8:0
redis-secondary_1  | 1:S 12 Dec 2021 07:08:04.792 * MASTER <-> REPLICA sync: receiving 2181 bytes from master to disk
redis-secondary_1  | 1:S 12 Dec 2021 07:08:04.792 * MASTER <-> REPLICA sync: Flushing old data
redis-secondary_1  | 1:S 12 Dec 2021 07:08:04.792 * MASTER <-> REPLICA sync: Loading DB in memory
redis-secondary_1  | 1:S 12 Dec 2021 07:08:04.797 * Loading RDB produced by version 6.2.6
redis-secondary_1  | 1:S 12 Dec 2021 07:08:04.797 * RDB age 0 seconds
redis-secondary_1  | 1:S 12 Dec 2021 07:08:04.797 * RDB memory usage when created 1.84 Mb
redis-secondary_1  | 1:S 12 Dec 2021 07:08:04.797 # Done loading RDB, keys loaded: 101, keys expired: 0.
redis-secondary_1  | 1:S 12 Dec 2021 07:08:04.797 * MASTER <-> REPLICA sync: Finished with success
redis-secondary_1  | 1:S 12 Dec 2021 07:09:05.754 * 10000 changes in 60 seconds. Saving...
redis-secondary_1  | 1:S 12 Dec 2021 07:09:05.755 * Background saving started by pid 36
redis-secondary_1  | 36:C 12 Dec 2021 07:09:05.760 * DB saved on disk
redis-secondary_1  | 36:C 12 Dec 2021 07:09:05.760 * RDB: 0 MB of memory used by copy-on-write
redis-secondary_1  | 1:S 12 Dec 2021 07:09:05.855 * Background saving terminated with success
```

and when you'll save new key to primary
```
set foo 'bar'
```
you'll that key on redis-secondary also
```
get foo
```

## Eviction policies

Preconditions:
* python script `keys-eviction.py` which inserts configured number of normal records and records with expiration
* redis-primary was set up with maxmemory 2mb (if I configured < 2mb Redis refused to store any key)
* expected keys count without eviction 10 (5 normal and 5 with expiration)
* for iteration 0 (key=foo-bar-0-noexp and foo-bar-0-noexp) we do additional warm ups to increase their chances to survive eviction
* set `maxmemory-samples 10` option for Redis to ensure more or less consistent LRU cache eviction results
* command used
```
ITERATIONS=5 python keys-eviction.py
```

### `noeviction`

```
count = 0
key=foo-bar-0-noexp
key_exp=foo-bar-0-withexp
count = 1
key=foo-bar-1-noexp
key_exp=foo-bar-1-withexp
count = 2
key=foo-bar-2-noexp
key_exp=foo-bar-2-withexp
count = 3
key=foo-bar-3-noexp
count = 4
key=foo-bar-4-noexp
keys without expiration count = [b'foo-bar-0-noexp', b'foo-bar-1-noexp', b'foo-bar-2-noexp']
keys with expiration count = [b'foo-bar-0-withexp', b'foo-bar-1-withexp', b'foo-bar-2-withexp']
{'evicted_keys': 0}
errors {"OOM command not allowed when used memory > 'maxmemory'.": 2}
```
which means that script saved 3 normal keys, 3 keys with expiration + we had 2 OOM errors and could'n save more keys

### `volatile-lru`

```
count = 0
key=foo-bar-0-noexp
key_exp=foo-bar-0-withexp
count = 1
key=foo-bar-1-noexp
key_exp=foo-bar-1-withexp
count = 2
key=foo-bar-2-noexp
key_exp=foo-bar-2-withexp
count = 3
key=foo-bar-3-noexp
key_exp=foo-bar-3-withexp
count = 4
key=foo-bar-4-noexp
key_exp=foo-bar-4-withexp
keys without expiration count = [b'foo-bar-0-noexp', b'foo-bar-1-noexp', b'foo-bar-2-noexp', b'foo-bar-3-noexp', b'foo-bar-4-noexp']
keys with expiration count = [b'foo-bar-0-withexp', b'foo-bar-3-withexp', b'foo-bar-4-withexp']
{'evicted_keys': 2}
errors {}
```
we see that 2 keys were evicted (both with expire time). And since we did additional work with key `foo-bar-0-withexp` it survived. So keys `foo-bar-1-withexp` and `foo-bar-2-withexp` were evicted.

### `allkeys-lru`

```
count = 0
key=foo-bar-0-noexp
key_exp=foo-bar-0-withexp
count = 1
key=foo-bar-1-noexp
key_exp=foo-bar-1-withexp
count = 2
key=foo-bar-2-noexp
key_exp=foo-bar-2-withexp
count = 3
key=foo-bar-3-noexp
key_exp=foo-bar-3-withexp
count = 4
key=foo-bar-4-noexp
key_exp=foo-bar-4-withexp
keys without expiration count = [b'foo-bar-0-noexp', b'foo-bar-1-noexp', b'foo-bar-3-noexp', b'foo-bar-4-noexp']
keys with expiration count = [b'foo-bar-0-withexp', b'foo-bar-2-withexp', b'foo-bar-3-withexp', b'foo-bar-4-withexp']
{'evicted_keys': 2}
errors {}
```
we see that Redis kept alive both `0` keys

### `volatile-lfu`

```
count = 0
key=foo-bar-0-noexp
key_exp=foo-bar-0-withexp
count = 1
key=foo-bar-1-noexp
key_exp=foo-bar-1-withexp
count = 2
key=foo-bar-2-noexp
key_exp=foo-bar-2-withexp
count = 3
key=foo-bar-3-noexp
key_exp=foo-bar-3-withexp
count = 4
key=foo-bar-4-noexp
key_exp=foo-bar-4-withexp
keys without expiration count = [b'foo-bar-0-noexp', b'foo-bar-1-noexp', b'foo-bar-2-noexp', b'foo-bar-3-noexp', b'foo-bar-4-noexp']
keys with expiration count = [b'foo-bar-0-withexp', b'foo-bar-3-withexp', b'foo-bar-4-withexp']
{'evicted_keys': 2}
errors {}
```

### `allkeys-lfu`
```
count = 0
key=foo-bar-0-noexp
key_exp=foo-bar-0-withexp
count = 1
key=foo-bar-1-noexp
key_exp=foo-bar-1-withexp
count = 2
key=foo-bar-2-noexp
key_exp=foo-bar-2-withexp
count = 3
key=foo-bar-3-noexp
key_exp=foo-bar-3-withexp
count = 4
key=foo-bar-4-noexp
key_exp=foo-bar-4-withexp
keys without expiration count = [b'foo-bar-0-noexp', b'foo-bar-2-noexp', b'foo-bar-3-noexp', b'foo-bar-4-noexp']
keys with expiration count = [b'foo-bar-0-withexp', b'foo-bar-2-withexp', b'foo-bar-3-withexp', b'foo-bar-4-withexp']
{'evicted_keys': 2}
errors {}
```

### `volatile-random`
```
count = 0
key=foo-bar-0-noexp
key_exp=foo-bar-0-withexp
count = 1
key=foo-bar-1-noexp
key_exp=foo-bar-1-withexp
count = 2
key=foo-bar-2-noexp
key_exp=foo-bar-2-withexp
count = 3
key=foo-bar-3-noexp
key_exp=foo-bar-3-withexp
count = 4
key=foo-bar-4-noexp
key_exp=foo-bar-4-withexp
keys without expiration count = [b'foo-bar-0-noexp', b'foo-bar-1-noexp', b'foo-bar-2-noexp', b'foo-bar-3-noexp', b'foo-bar-4-noexp']
keys with expiration count = [b'foo-bar-0-withexp', b'foo-bar-2-withexp', b'foo-bar-4-withexp']
{'evicted_keys': 2}
errors {}
```

### `allkeys-random`
```
count = 0
key=foo-bar-0-noexp
key_exp=foo-bar-0-withexp
count = 1
key=foo-bar-1-noexp
key_exp=foo-bar-1-withexp
count = 2
key=foo-bar-2-noexp
key_exp=foo-bar-2-withexp
count = 3
key=foo-bar-3-noexp
key_exp=foo-bar-3-withexp
count = 4
key=foo-bar-4-noexp
key_exp=foo-bar-4-withexp
keys without expiration count = [b'foo-bar-0-noexp', b'foo-bar-1-noexp', b'foo-bar-4-noexp']
keys with expiration count = [b'foo-bar-0-withexp', b'foo-bar-1-withexp', b'foo-bar-2-withexp', b'foo-bar-3-withexp', b'foo-bar-4-withexp']
{'evicted_keys': 2}
errors {}
```

### `volatile-ttl`
```
count = 0
key=foo-bar-0-noexp
key_exp=foo-bar-0-withexp
count = 1
key=foo-bar-1-noexp
key_exp=foo-bar-1-withexp
count = 2
key=foo-bar-2-noexp
key_exp=foo-bar-2-withexp
count = 3
key=foo-bar-3-noexp
key_exp=foo-bar-3-withexp
count = 4
key=foo-bar-4-noexp
key_exp=foo-bar-4-withexp
keys without expiration count = [b'foo-bar-0-noexp', b'foo-bar-1-noexp', b'foo-bar-2-noexp', b'foo-bar-3-noexp', b'foo-bar-4-noexp']
keys with expiration count = [b'foo-bar-0-withexp', b'foo-bar-3-withexp', b'foo-bar-4-withexp']
{'evicted_keys': 2}
errors {}
```

## Probabilistic cache refhresh

Already done in [L4 homework](https://github.com/Nazar910/hsa-5/tree/main/L4) but as of interest in learning Python will do it again :)

### Prerequisites
* users table with 10m records
* complex group by query on GET / request that takes up to 700 ms to execute
* redis cache record TTL = 5 sec
* siege command = `siege -c25 -t60s http://localhost:5000`


scratch code
```python
def should_recompute(delta, beta, ttl):
    now_ms = time.time() * 1000
    return now_ms - delta * beta * math.log(random.random()) >= now_ms + ttl * 1000

async def recompute():
    start_time = time.time() * 1000
    data = await compute()
    delta = time.time() * 1000 - start_time

    result = {'data': data, 'delta': delta}

    redisClient.setex(cache_key, 15, json.dumps(result))

    return result

async def get_with_cache():
    ttl = redisClient.ttl(cache_key)

    if ttl > 0:
        result = redisClient.get(cache_key)
        parsed_json = json.loads(result)

        if should_recompute(parsed_json['delta'], 1, ttl):
            return await recompute()

        return parsed_json

    return await recompute()
```

### Result without probabilistic cache refresh

```
Transactions:		       64355 hits
Availability:		      100.00 %
Elapsed time:		       59.47 secs
Data transferred:	        0.12 MB
Response time:		        0.07 secs
Transaction rate:	     1082.14 trans/sec
Throughput:		        0.00 MB/sec
Concurrency:		       72.88
Successful transactions:       64355
Failed transactions:	           0
Longest transaction:	       20.34
Shortest transaction:	        0.00
```

### Result with probabilistic cache refresh
```
Transactions:		       42620 hits
Availability:		      100.00 %
Elapsed time:		       59.92 secs
Data transferred:	        0.08 MB
Response time:		        0.08 secs
Transaction rate:	      711.28 trans/sec
Throughput:		        0.00 MB/sec
Concurrency:		       57.59
Successful transactions:       42620
Failed transactions:	           0
Longest transaction:	       14.68
Shortest transaction:	        0.00

```
