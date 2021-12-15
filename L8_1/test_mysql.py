import pymysql
import pymysql.cursors
from multiprocessing import Process, process
import time


def get_connection():
    con = pymysql.connect(
        host='localhost',
        user='root',
        password='example',
        db='l8_1_db',
        charset='utf8mb4'
    )

    con.autocommit = False

    return con


def ensure_tables():
    con = get_connection()
    with con:
        con.query("""
            CREATE TABLE IF NOT EXISTS tbl1 (
                id INT NOT NULL AUTO_INCREMENT,
                f1 INT NOT NULL,
                f2 INT NOT NULL,
                PRIMARY KEY (id)
            )
        """)
        con.query('SET autocommit=0')
        con.query('SET GLOBAL innodb_status_output=ON')
        con.query('SET GLOBAL innodb_status_output_locks=ON')
        con.commit()


def ensure_data():
    con = get_connection()
    with con:
        con.query('DELETE FROM tbl1')
        con.query('INSERT INTO tbl1 (f1, f2) VALUES (1, 0)')
        con.query('INSERT INTO tbl1 (f1, f2) VALUES (2, 0)')
        con.commit()


def print_table():
    con = get_connection()

    with con:
        with con.cursor() as cursor:
            cursor.execute('SELECT * FROM tbl1')
            results = cursor.fetchall()
            print(results)

def lost_update():
    def session1():
        con = get_connection()
        with con:
            with con.cursor() as cursor:
                cursor.execute('UPDATE tbl1 SET f2=f2+20 WHERE f1=1;')
                print('session1: update finished')
            con.commit()

    def session2():
        con = get_connection()
        with con:
            with con.cursor() as cursor:
                cursor.execute('UPDATE tbl1 SET f2=f2+25 WHERE f1=1;')
                print('session2: update finished')
            con.commit()

    p1 = Process(target=session1)
    p1.start()
    p2 = Process(target=session2)
    p2.start()
    p1.join()
    p2.join()

    con = get_connection()

    with con:
        cursor = con.cursor()

        cursor.execute('SELECT * FROM tbl1')
        results = cursor.fetchall()
        print(results)


def dirty_read():
    def session1():
        con = get_connection()
        with con:
            with con.cursor() as cursor:
                cursor.execute('SELECT f2 FROM tbl1 WHERE f1=1')
                print('session1: select finished % s' % cursor.fetchmany())
                cursor.execute('UPDATE tbl1 SET f2=f2+1 WHERE f1=1')
                print('session1: update finished')
            time.sleep(2)
            con.commit()
            print('session 1: commit')

    def session2():
        con = get_connection()
        with con:
            time.sleep(1)
            with con.cursor() as cursor:
                cursor.execute('SELECT f2 FROM tbl1 WHERE f1=1')
                print('session2: select finished % s' % cursor.fetchmany())

    p1 = Process(target=session1)
    p1.start()
    p2 = Process(target=session2)
    p2.start()
    p1.join()
    p2.join()

    con = get_connection()

    with con:
        cursor = con.cursor()

        cursor.execute('SELECT * FROM tbl1')
        results = cursor.fetchall()
        print(results)


TRANSACTION_LVLS = [
    'READ UNCOMMITTED',
    'READ COMMITTED',
    'REPEATABLE READ',
    'SERIALIZABLE',
]


def test_levels():
    ensure_tables()
    for level in TRANSACTION_LVLS:
        ensure_data()
        print('Level: %s' % level)
        with get_connection() as con:
            with con.cursor() as cursor:
                cursor.execute(
                    'SET GLOBAL TRANSACTION ISOLATION LEVEL %s' % level)

            con.commit()

        lost_update()
        print_table()
        # dirty_read()
        # print_table()


test_levels()
