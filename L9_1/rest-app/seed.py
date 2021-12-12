import psycopg2
import random

conn = psycopg2.connect(
    host='localhost',
    database='test_db',
    user='testuser',
    password='testpassword'
)

cur = conn.cursor()

for i in range(0, 10_000):
    for j in range(0, 1000):
        cur.execute("INSERT INTO users(name, favourite_number) VALUES (%s, %s)",  ('user-%d' % i, random.randint(0, 100)))
    conn.commit()
    print('commit')

cur.close()
conn.close()
