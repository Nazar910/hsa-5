import greenstalk
import json

with greenstalk.Client(('127.0.0.1', '11300')) as client:
    client.use('foo_bar')

    msg = json.dumps({ 'foo': 'bar' })
    client.put(msg)
    print('Success')
