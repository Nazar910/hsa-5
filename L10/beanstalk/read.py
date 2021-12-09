import greenstalk
import json

with greenstalk.Client(('127.0.0.1', '11300')) as client:
    client.use('foo_bar')

    while True:
        print('about to reserve')
        job = client.reserve()
        print('Got job')
        print(job.body)
        client.delete(job)
