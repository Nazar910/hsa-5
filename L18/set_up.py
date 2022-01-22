import pymysql
import pymysql.cursors
import os


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


def insert_primary(counter):
    con_primary.begin()
    con_primary.query(
        'INSERT INTO events(name, counter, description) VALUES (\'some-event-{}\', {}, \'some-descr-{}\')'.format(counter, counter, counter))
    con_primary.commit()


def cursor_exec(con, query):
    cursor = con.cursor()
    cursor.execute(query)
    return cursor.fetchall()


def print_select_events(con):
    print(cursor_exec(con, 'SELECT * FROM events'))


def set_up_secondary(host, con):
    os.system(
        'docker-compose exec {} bash -c "mysql -u root -p\'pass\' mydb < /opt/data/mysql/mydb.sql"'.format(host))

    con.query("""
        CHANGE MASTER TO MASTER_HOST='mysql-m', MASTER_USER='slave', MASTER_PASSWORD='password',
            MASTER_LOG_FILE = '{}', MASTER_LOG_POS = {};
    """.format(master_status['File'], master_status['Position']))
    con.query('START SLAVE')

    [s_status] = cursor_exec(con, 'SHOW SLAVE STATUS')

    print('{} slave status:'.format(host))
    print(s_status)


con_primary = get_connection(3306)
con_s1 = get_connection(3307)
con_s2 = get_connection(3308)

# ============ Configure primary node ============
# ensure tables on master
con_primary.query("DROP TABLE IF EXISTS events")
con_primary.query(
    """
    CREATE TABLE events(
        id INT NOT NULL AUTO_INCREMENT,
        name CHAR(30) NOT NULL,
        counter INT NOT NULL,
        description TEXT NOT NULL,
        PRIMARY KEY(id)
    ) ENGINE=InnoDB;
    """
)
print('Table structure on primary setup finished')

insert_primary(0)
print('Initial data on primary node')
print_select_events(con_primary)

con_primary.query("GRANT REPLICATION SLAVE ON *.* TO 'slave'@'%' IDENTIFIED BY 'password'")
con_primary.query("FLUSH PRIVILEGES")
con_primary.query("USE mydb")
con_primary.query("FLUSH TABLES WITH READ LOCK")

[ master_status ] = cursor_exec(con_primary, 'SHOW MASTER STATUS')

print(master_status)

os.system('docker-compose exec mysql-m bash -c "mysqldump -u root -p\'pass\' mydb > /opt/data/mysql/mydb.sql"')

con_primary.query("UNLOCK TABLES")

# ============ Configure secondary nodes ============
set_up_secondary('mysql-s-1', con_s1)
set_up_secondary('mysql-s-2', con_s2)

# ============ Insert some data and check ============
for i in range(1, 10):
    insert_primary(i)

print('data on primary')
print_select_events(con_primary)

print('data on s1')
print_select_events(con_s1)

print('data on s2')
print_select_events(con_s2)
