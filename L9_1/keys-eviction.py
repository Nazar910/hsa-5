from redis import Redis, ResponseError
import os

ITERATIONS = int(os.environ.get('ITERATIONS'))
errors = {}

def get_key(i):
    return 'foo-bar-%d-noexp' % i

def get_key_exp(i):
    return 'foo-bar-%d-withexp' % i

def get_val():
    return '#'.join(list(map(lambda e: 'foo-val-%d' % e, range(0, 1300))))

with Redis(host='localhost', port=6379, db=0, password='foobared') as redisClient:
    for i in range(0, ITERATIONS):
        print('count = %d' % i)
        try:
            key = get_key(i)
            print('key=%s' % key)
            redisClient.set(key, get_val())
            key_exp = get_key_exp(i)
            print('key_exp=%s' % key_exp)
            redisClient.setex(key_exp, 10, get_val())
        except ResponseError as e:
            errors[e.args[0]] = errors.get(e.args[0]) + 1 if errors.get(e.args[0]) else 1

    redisClient.get(get_key(0))
    redisClient.get(get_key(0))
    redisClient.get(get_key_exp(0))
    redisClient.expire(get_key_exp(0), 10)

    stored_no_exp_keys = redisClient.keys('*-noexp')
    stored_exp_keys = redisClient.keys('*-withexp')

    print('keys without expiration count = %s' % sorted(stored_no_exp_keys))
    print('keys with expiration count = %s' % sorted(stored_exp_keys))
    print({ k: v for k, v in redisClient.info().items() if k == 'evicted_keys' })
    print('errors %s' % errors)
