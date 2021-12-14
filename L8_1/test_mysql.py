# from mysql.connector import connect

import pymysql
import pymysql.cursors

def get_connection():
    con = pymysql.connect(host='localhost',
        user='root',
        password='example',
        db='l8_1_db',
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor)
    con.autocommit = False

    return con

def ensure_tables():
    con = get_connection()
    with con:
        con.query("""
            CREATE TABLE IF NOT EXISTS tabl1 (
                id INT NOT NULL AUTO_INCREMENT,
                f1 INT NOT NULL,
                f2 INT NOT NULL,
                PRIMARY KEY (id)
            )
        """)
        con.query('INSERT INTO tabl1 (f1, f2) VALUES (1, 0)')
        con.commit()

def lost_update():
    con1 = get_connection()
    con2 = get_connection()

    con1.begin()
    con1.query('UPDATE tbl1 SET f2=f2+20 WHERE f1=1;')

    con2.begin()
    con2.query('UPDATE tbl1 SET f2=f2+25 WHERE f1=1;')

    con2.commit()

    con1.commit()

    con1.close()
    con2.close()

    con = get_connection()

    with con:
        cursor = con.cursor()

        cursor.execute('SELECT * FROM tabl1')
        results = cursor.fetchall()
        print(results)

TRANSACTION_LVLS = [
    'READ UNCOMMITED',
    'READ COMMITED',
    'REPEATABLE_READ',
    'SERILIZABLE'
]

def cases():
    for case in TRANSACTION_LVLS:
        with get_connection() as con:
            con.query('SET TRANSACTION ISOLATION LEVEL %s' % case)
            con.commit()

        lost_update()



ensure_tables()
cases()
