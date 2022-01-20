import pymysql
import time


def get_connection():
    con = pymysql.connect(
        host='localhost',
        user='root',
        password='pass',
        db='mydb',
        charset='utf8mb4',
    )

    con.autocommit = True

    return con

con = get_connection()

with con:
    for i in range(0, 1_000_000):
        con.query('INSERT INTO events(name) VALUES (some-event-{})'.format())
        time.sleep(0.5)
