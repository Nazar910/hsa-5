import pymysql
import pymysql.cursors

def get_connection(port):
    con = pymysql.connect(
        host='localhost',
        user='root',
        password='pass',
        db='mydb',
        charset='utf8mb4',
        port=port,
        cursorclass=pymysql.cursors.DictCursor
    )

    return con


def get_count(con):
    cursor = con.cursor()
    cursor.execute('SELECT COUNT(*) as count FROM events')
    result = cursor.fetchone()
    return result['count']

con_primary = get_connection(3306)
con_s1 = get_connection(3307)
con_s2 = get_connection(3308)

for counter in range(0, 1):
    con_primary.begin()
    con_primary.query(
        'INSERT INTO events(name, counter, description) VALUES (\'some-event-{}\', {}, \'some-descr-{}\')'.format(counter, counter, counter))
    con_primary.commit()

print('mysql-m count: {}'.format(get_count(con_primary)))
# print('mysql-s-1 count: OUT')
print('mysql-s-1 count: {}'.format(get_count(con_s1)))
print('mysql-s-2 count: {}'.format(get_count(con_s2)))
