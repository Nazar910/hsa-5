import pymysql
import pymysql.cursors
from multiprocessing import Process
import time


def get_connection():
    con = pymysql.connect(
        host='localhost',
        user='root',
        password='example',
        db='l8_1_db',
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor
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
    print('==========================LOST UPDATE========================')

    def session1():
        con = get_connection()
        with con:
            con.begin()
            with con.cursor() as cursor:
                cursor.execute('UPDATE tbl1 SET f2=f2+20 WHERE f1=1;')
                print('session1: update finished')
            con.commit()

    def session2():
        con = get_connection()
        with con:
            con.begin()
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
    print('=============================================================')


def dirty_read():
    print('==========================DIRTY READ========================')

    def session1():
        con = get_connection()
        with con:
            con.begin()
            with con.cursor() as cursor:
                cursor.execute('SELECT f2 FROM tbl1 WHERE f1=1')
                print('session1: select finished % s' % cursor.fetchmany())
                cursor.execute('UPDATE tbl1 SET f2=f2+1 WHERE f1=1')
                print('session1: update finished')
            time.sleep(2)
            con.rollback()
            print('session 1: rollback')

    def session2():
        con = get_connection()
        with con:
            con.begin()
            time.sleep(1)
            with con.cursor() as cursor:
                cursor.execute('SELECT f2 FROM tbl1 WHERE f1=1')
                print('session 2: select finished % s' % cursor.fetchmany())
            con.commit()
            print('session 2: commit')

    p1 = Process(target=session1)
    p1.start()
    p2 = Process(target=session2)
    p2.start()
    p1.join()
    p2.join()
    print('=============================================================')


def non_repeatable_read():
    print('======================NON REPEATABLE READ======================')

    def session1():
        con = get_connection()
        with con:
            con.begin()
            with con.cursor() as cursor:
                cursor.execute('SELECT f2 FROM tbl1 WHERE f1=1')
                print('session 1: select finished % s' % cursor.fetchmany())
                time.sleep(0.01)
                cursor.execute('UPDATE tbl1 SET f2=f2+1 WHERE f1=1')
                print('session 1: update finished')
            con.commit()
            print('session 1: commit')

    def session2():
        con = get_connection()
        with con:
            con.begin()
            time.sleep(0.01)
            with con.cursor() as cursor:
                cursor.execute('SELECT f2 FROM tbl1 WHERE f1=1')
                print('session 2: first select finished % s' %
                      cursor.fetchmany())
                time.sleep(2)
                cursor.execute('SELECT f2 FROM tbl1 WHERE f1=1')
                print('session 2: second select finished % s' %
                      cursor.fetchmany())
            con.commit()
            print('session 2: commit')

    p1 = Process(target=session1)
    p1.start()
    p2 = Process(target=session2)
    p2.start()
    p1.join()
    p2.join()
    print('=============================================================')


def phantom_read():
    print('======================PHANTOM READ======================')

    def session1():
        con = get_connection()
        with con:
            con.begin()
            time.sleep(1)
            with con.cursor() as cursor:
                cursor.execute('INSERT INTO tbl1 (f1, f2) VALUES (15,20)')
                print('session 1: insert finished')
            con.commit()
            print('session 1: commit')

    def session2():
        con = get_connection()
        with con:
            con.begin()
            with con.cursor() as cursor:
                cursor.execute('SELECT sum(f2) FROM tbl1')
                print('session 2: first select finished % s' %
                      cursor.fetchmany())
                time.sleep(2)
                cursor.execute('SELECT sum(f2) FROM tbl1')
                print('session 2: second select finished % s' %
                      cursor.fetchmany())
            con.commit()
            print('session 2: commit')

    p1 = Process(target=session1)
    p1.start()
    p2 = Process(target=session2)
    p2.start()
    p1.join()
    p2.join()
    print('=============================================================')


TRANSACTION_LVLS = [
    'READ UNCOMMITTED',
    'READ COMMITTED',
    'REPEATABLE READ',
    'SERIALIZABLE',
]


def test_levels():
    ensure_tables()
    for level in TRANSACTION_LVLS:
        print('=============TRANSACTION LEVEL = %s ====================' % level)
        con = get_connection()
        with con:
            with con.cursor() as cursor:
                cursor.execute(
                    'SET GLOBAL TRANSACTION ISOLATION LEVEL %s' % level)

            con.commit()

        for case in [lost_update, dirty_read, non_repeatable_read, phantom_read]:
            ensure_data()
            case()
            print_table()


test_levels()
