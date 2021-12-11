import greenstalk
import json
import time
import os

JOB_COUNT = int(os.environ.get('JOB_COUNT'))

with greenstalk.Client(('127.0.0.1', '11300')) as client:
    client.use('foo_bar')

    start_time = time.time()

    for i in range(0, JOB_COUNT):
        client.put('{"foo":%d}' % i)

    print("--- %s seconds ---" % (time.time() - start_time))
