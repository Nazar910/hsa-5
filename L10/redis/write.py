import redis
import time
import os

JOB_COUNT = int(os.environ.get('JOB_COUNT'))
PORT = int(os.environ.get('REDIS_PORT'))

with redis.Redis(host='localhost', port=PORT, db=0) as redis:
    start_time = time.time()

    for i in range(0, JOB_COUNT):
        redis.rpush('foo_bar_queue', '{"foo":%d}' % i)

    print("--- %s seconds ---" % (time.time() - start_time))
