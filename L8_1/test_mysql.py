import pymysql
import pymysql.cursors


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


def lost_update():
    con1 = get_connection()
    con2 = get_connection()

    cursor1 = con1.cursor()
    cursor2 = con2.cursor()

    con1.begin()
    con2.begin()

    print('Got cursors')

    cursor1.execute('UPDATE tbl1 SET f2=f2+20 WHERE f1=1;')
    print('cursor1.execute')

    cursor2.execute('UPDATE tbl1 SET f2=f2+25 WHERE f1=1;')
    print('cursor2.execute')

    con2.commit()
    print('con2.commit')

    con1.commit()
    print('con1.commit')

    cursor1.close()
    con1.close()

    cursor2.close()
    con2.close()

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


test_levels()
