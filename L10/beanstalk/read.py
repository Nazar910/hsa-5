import greenstalk
import json
import time
import os

JOB_COUNT = int(os.environ.get('JOB_COUNT'))

with greenstalk.Client(('127.0.0.1', '11300')) as client:
    client.watch('foo_bar')

    job_read_count = 0
    start_time = time.time()

    while job_read_count < JOB_COUNT:
        job = client.reserve()
        # print(job.body)
        client.delete(job)
        job_read_count+=1

    print("--- %s seconds ---" % (time.time() - start_time))
