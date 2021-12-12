import tornado.ioloop
import tornado.web
import psycopg2
from redis import Redis
import json
import time
import math
import random

conn = psycopg2.connect(
    host='localhost',
    database='test_db',
    user='testuser',
    password='testpassword'
)

redisClient = Redis(
    host='localhost',
    port=6379,
    db=0,
    password='foobared'
)

cache_key = 'cached_record_sql'

def compute():
    cur = conn.cursor()

    cur.execute('select favourite_number, count(id) from users group by favourite_number order by count(id) desc limit 20;')
    result = cur.fetchmany()

    cur.close()

    return result

def should_recompute(delta, beta, ttl):
    now_ms = time.time() * 1000
    return now_ms - delta * beta * math.log(random.random()) >= now_ms + ttl * 1000

def recompute():
    start_time = time.time() * 1000
    data = compute()
    delta = time.time() * 1000 - start_time

    result = {'data': data, 'delta': delta}

    redisClient.setex(cache_key, 15, json.dumps(result))

    return result

def get_with_cache():
    result = redisClient.get(cache_key)
    ttl = redisClient.ttl(cache_key)

    if ttl > 0:
        parsed_json = json.loads(result)

        if should_recompute(parsed_json['delta'], 1, ttl):
            return recompute()

        return parsed_json

    return recompute()

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        get_with_cache()
        self.write("Ok")

def make_app():
    return tornado.web.Application([
        (r"/", MainHandler),
    ])

if __name__ == "__main__":
    app = make_app()
    app.listen(8888)
    tornado.ioloop.IOLoop.current().start()
