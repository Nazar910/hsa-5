# Purpose
The purpose of this project is to get some experience in stress testing and inspect max perfomance of my customer node app.

# Install

To get up infra and app
```
    $ docker-compose build && docker-compose up -d
```
Start node app (used request straight to node app because kept getting a lot of socker timeout errors making request to docker app)
```
    $ cd app
    $ npm run start:local
```

# Cache stampede prevention

## Reference
In this case [Cache propbabilistic early refresh](https://cseweb.ucsd.edu//~avattani/papers/cache_stampede.pdf) formula was used to prevent multiple request to database when our cache record got expired.

## Code
```javascript
...
async reCompute(name) {
    const startTime = Date.now();
    const result = await this.collection.findOne({
        name
    });
    const delta = Date.now() - startTime;

    const cacheKeyName = getKeyName(name);
    await this.redisClient.setex(cacheKeyName, REDIS_TTL_SEC, JSON.stringify({ data: result, delta }));

    return result;
}

shouldRecompute(delta, beta, expiry) {
    return Date.now() - delta * beta * Math.log(Math.random()) >= expiry;
}

async get(name) {
    const { redisClient } = this;

    const cacheKeyName = getKeyName(name);
    const [jsonStr, ttl] = await Promise.all([
        redisClient.get(cacheKeyName),
        redisClient.ttl(cacheKeyName)
    ]);

    if (ttl > 0) {
        const { data, delta } = JSON.parse(jsonStr);

        if (this.shouldRecompute(delta, 1, Date.now() + ttl)) {
            const result = await this.reCompute(name);
            return result;
        }

        return data;
    }

    const result = await this.reCompute(name);

    return result;
}
...
```

# Tools
* siege [github repo](https://github.com/JoeDog/siege) - lightweight and flexible benchmarking utility

# Tests

## Results

* `siege -c10 -t60s -i --file siege-urls.txt`

    * simple cache
        ```
        Lifting the server siege...
        Transactions:		      109646 hits
        Availability:		      100.00 %
        Elapsed time:		       59.19 secs
        Data transferred:	        7.11 MB
        Response time:		        0.01 secs
        Transaction rate:	     1852.44 trans/sec
        Throughput:		        0.12 MB/sec
        Concurrency:		        9.60
        Successful transactions:      109646
        Failed transactions:	           0
        Longest transaction:	        0.05
        Shortest transaction:	        0.00
        ```
    * improved
        ```
        Lifting the server siege...
        Transactions:		      104463 hits
        Availability:		      100.00 %
        Elapsed time:		       59.73 secs
        Data transferred:	        6.77 MB
        Response time:		        0.01 secs
        Transaction rate:	     1748.92 trans/sec
        Throughput:		        0.11 MB/sec
        Concurrency:		        9.64
        Successful transactions:      104463
        Failed transactions:	           0
        Longest transaction:	        0.04
        Shortest transaction:	        0.00
        ```


* `siege -c25 -t60s -i --file siege-urls.txt`

    * simple cache
        ```
        Lifting the server siege...
        Transactions:		      130144 hits
        Availability:		      100.00 %
        Elapsed time:		       59.28 secs
        Data transferred:	        8.44 MB
        Response time:		        0.01 secs
        Transaction rate:	     2195.41 trans/sec
        Throughput:		        0.14 MB/sec
        Concurrency:		       24.56
        Successful transactions:      130144
        Failed transactions:	           0
        Longest transaction:	        0.11
        Shortest transaction:	        0.00
        ```
    * improved
        ```
        Lifting the server siege...
        Transactions:		      112601 hits
        Availability:		      100.00 %
        Elapsed time:		       59.59 secs
        Data transferred:	        7.30 MB
        Response time:		        0.01 secs
        Transaction rate:	     1889.60 trans/sec
        Throughput:		        0.12 MB/sec
        Concurrency:		       24.69
        Successful transactions:      112601
        Failed transactions:	           0
        Longest transaction:	        0.09
        Shortest transaction:	        0.00
        ```


* `siege -c50 -t60s -i --file siege-urls.txt`

    * simple cache
        ```
        Lifting the server siege...
        Transactions:		      131258 hits
        Availability:		      100.00 %
        Elapsed time:		       59.49 secs
        Data transferred:	        8.51 MB
        Response time:		        0.02 secs
        Transaction rate:	     2206.39 trans/sec
        Throughput:		        0.14 MB/sec
        Concurrency:		       49.51
        Successful transactions:      131258
        Failed transactions:	           0
        Longest transaction:	        0.12
        Shortest transaction:	        0.00
        ```
    * improved
        ```
        Lifting the server siege...
        Transactions:		       80447 hits
        Availability:		      100.00 %
        Elapsed time:		       59.62 secs
        Data transferred:	        5.22 MB
        Response time:		        0.04 secs
        Transaction rate:	     1349.33 trans/sec
        Throughput:		        0.09 MB/sec
        Concurrency:		       49.70
        Successful transactions:       80447
        Failed transactions:	           0
        Longest transaction:	        0.10
        Shortest transaction:	        0.01
        ```

* `siege -c100 -t60s -i --file siege-urls.txt`

    * simple cache
        ```
        Lifting the server siege...
        Transactions:		      154751 hits
        Availability:		      100.00 %
        Elapsed time:		       59.86 secs
        Data transferred:	       10.04 MB
        Response time:		        0.04 secs
        Transaction rate:	     2585.22 trans/sec
        Throughput:		        0.17 MB/sec
        Concurrency:		       99.42
        Successful transactions:      154751
        Failed transactions:	           0
        Longest transaction:	        0.17
        Shortest transaction:	        0.01
        ```
    * improved
        ```
        Lifting the server siege...
        Transactions:		      142344 hits
        Availability:		      100.00 %
        Elapsed time:		       59.76 secs
        Data transferred:	        9.23 MB
        Response time:		        0.04 secs
        Transaction rate:	     2381.93 trans/sec
        Throughput:		        0.15 MB/sec
        Concurrency:		       99.59
        Successful transactions:      142344
        Failed transactions:	           0
        Longest transaction:	        0.14
        Shortest transaction:	        0.01
        ```

* `siege -c150 -t60s -i --file siege-urls.txt`

    * simple cache
        ```
        Lifting the server siege...
        Transactions:		      154948 hits
        Availability:		      100.00 %
        Elapsed time:		       59.98 secs
        Data transferred:	       10.05 MB
        Response time:		        0.06 secs
        Transaction rate:	     2583.33 trans/sec
        Throughput:		        0.17 MB/sec
        Concurrency:		      149.38
        Successful transactions:      154948
        Failed transactions:	           0
        Longest transaction:	        0.23
        Shortest transaction:	        0.02
        ```
    * improved
        ```
        Lifting the server siege...
        Transactions:		      127641 hits
        Availability:		      100.00 %
        Elapsed time:		       59.76 secs
        Data transferred:	        8.28 MB
        Response time:		        0.07 secs
        Transaction rate:	     2135.89 trans/sec
        Throughput:		        0.14 MB/sec
        Concurrency:		      149.37
        Successful transactions:      127641
        Failed transactions:	           0
        Longest transaction:	        0.18
        Shortest transaction:	        0.02
        ```

* `siege -c255 -t60s -i --file siege-urls.txt`

    * simple cache
        ```
        Lifting the server siege...
        Transactions:		      146960 hits
        Availability:		      100.00 %
        Elapsed time:		       59.80 secs
        Data transferred:	        9.53 MB
        Response time:		        0.10 secs
        Transaction rate:	     2457.53 trans/sec
        Throughput:		        0.16 MB/sec
        Concurrency:		      254.07
        Successful transactions:      146960
        Failed transactions:	           0
        Longest transaction:	        0.59
        Shortest transaction:	        0.03
        ```
    * improved
        ```
        Lifting the server siege...
        Transactions:		      131179 hits
        Availability:		      100.00 %
        Elapsed time:		       59.96 secs
        Data transferred:	        8.51 MB
        Response time:		        0.12 secs
        Transaction rate:	     2187.78 trans/sec
        Throughput:		        0.14 MB/sec
        Concurrency:		      254.23
        Successful transactions:      131179
        Failed transactions:	           0
        Longest transaction:	        0.34
        Shortest transaction:	        0.01
        ```

And my investigations stopped here because of siege limit to 255 concurrent user :)

# Conclusion

Using cache probabilistic refresh technique (particularly with Node.js apps) allows
to reduce max request duration but reduces max throughput (I suppose because of node.js Eventloop it'll wait before serving another request while we're calculating probabilistic coef)
