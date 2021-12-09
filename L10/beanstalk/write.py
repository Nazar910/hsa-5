import greenstalk
import json

with greenstalk.Client(('127.0.0.1', '11300')) as client:
    client.use('foo_bar')

    for i in range(0, 100):
        msg = json.dumps({ 'foo': i })
        client.put(msg)
