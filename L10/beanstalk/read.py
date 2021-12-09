import greenstalk
import json

with greenstalk.Client(('127.0.0.1', '11300')) as client:
    client.watch('foo_bar')

    while True:
        job = client.reserve()
        print(job.body)
        client.delete(job)
