# Task
Configure nginx images caching:
* cache only images requested atleast twice
* add ability to drop cache of specifiec file

# Prerequisites

* docker-compose util installed
* start up project using following script:

```
    $ docker-compose up -d
```

# Caching mechanism

We can try to load 1.jpg in our browser by url http://localhost:8080/1.jpg.
Take a look at response headers:

There is a header called `X-Proxy-Cache`. It indicates whether our request was processed by using value from cache or proxying to upstream.

When we try to load image `1.jpg` for the first time it shows `MISS`, which means that there is no record for this images in cache. Same on the second request. But when we load it for the 3rd time, we'll get `HIT` value, meaning that this time value was in cache.

This behaviour was achieved by using `proxy_cache_min_uses 2` option (take a look at [nginx.conf]()), to allow us to cache not all requested resources, but only the once that requested more than one time.
```
            add_header X-Proxy-Cache $upstream_cache_status;
            proxy_ignore_headers "Set-Cookie";
            proxy_cache my_cache;
            proxy_cache_min_uses 2;
            proxy_cache_valid 200 60m;
            proxy_cache_key $proxy_host$request_uri;
```

# Drop speciefic value in cache

This was achieved by using additional lua script that goes right into the `/data/nginx/cache` dir and drop cache record. For this we added new HTTP method `PURGE`.
Because we know what `proxy_cache_key` is and we know where data is stored. In order to find out which record is ours we just calculate md5 of our `cache_key` (taking into account cache levels) and searching for that file on fs (check [lua script]() source). Btw this script was taken with a small update from https://scene-si.org/2016/11/02/purging-cached-items-from-nginx-with-lua.

Example:
* we have loaded 2.jpg into cache (got `X-Proxy-Cache: HIT`)
* curl -X PURGE http://localhost:8080/2.jpg
* when we hit http://localhost:8080/2.jpg in our browser we'll see `X-Proxy-Cache: MISS` + there will be no cache record in /data/nginx/cache for this image.

# Project structure

* python static server - serves 3 images (1.jpg, 2.jpg and 3.jpg)
* nginx as a proxy - proxy passes request to Python static server
