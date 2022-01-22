# Tasks
* set up 3 node cluster: mysql-m, mysql-s1 and mysql-s2
* set up frequent inserts and check data consistency for all instances
* try to turn off mysql-s1
* try to remove a column in a database on replica

# Prerequisites
* ensure you *-conf.d directories have valid permissions
```
    $ chmod 555 mysql-m-conf.d
```
* Run all infra
```
    $ docker-compose up -d
```
* set up python env
```
    $ python3 -m venv venv
    $ source ./venv/bin/activate
    $ pip install -r requirements.txt
```

# Results

* set up replication using python script
```
    $ python set_up.py
```
Output
```
Table structure on primary setup finished
Initial data on primary node
[{'id': 1, 'name': 'some-event-0', 'counter': 0, 'description': 'some-descr-0'}]
{'File': 'mysql-bin.000003', 'Position': 1494, 'Binlog_Do_DB': 'mydb', 'Binlog_Ignore_DB': '', 'Executed_Gtid_Set': ''}
mysqldump: [Warning] Using a password on the command line interface can be insecure.
mysql: [Warning] Using a password on the command line interface can be insecure.
mysql-s-1 slave status:
{'Slave_IO_State': 'Checking master version', 'Master_Host': 'mysql-m', 'Master_User': 'slave', 'Master_Port': 3306, 'Connect_Retry': 60, 'Master_Log_File': 'mysql-bin.000003', 'Read_Master_Log_Pos': 1494, 'Relay_Log_File': 'mysql-relay-bin.000001', 'Relay_Log_Pos': 4, 'Relay_Master_Log_File': 'mysql-bin.000003', 'Slave_IO_Running': 'Yes', 'Slave_SQL_Running': 'Yes', 'Replicate_Do_DB': '', 'Replicate_Ignore_DB': '', 'Replicate_Do_Table': '', 'Replicate_Ignore_Table': '', 'Replicate_Wild_Do_Table': '', 'Replicate_Wild_Ignore_Table': '', 'Last_Errno': 0, 'Last_Error': '', 'Skip_Counter': 0, 'Exec_Master_Log_Pos': 1494, 'Relay_Log_Space': 154, 'Until_Condition': 'None', 'Until_Log_File': '', 'Until_Log_Pos': 0, 'Master_SSL_Allowed': 'No', 'Master_SSL_CA_File': '', 'Master_SSL_CA_Path': '', 'Master_SSL_Cert': '', 'Master_SSL_Cipher': '', 'Master_SSL_Key': '', 'Seconds_Behind_Master': 0, 'Master_SSL_Verify_Server_Cert': 'No', 'Last_IO_Errno': 0, 'Last_IO_Error': '', 'Last_SQL_Errno': 0, 'Last_SQL_Error': '', 'Replicate_Ignore_Server_Ids': '', 'Master_Server_Id': 1, 'Master_UUID': '', 'Master_Info_File': '/var/lib/mysql/master.info', 'SQL_Delay': 0, 'SQL_Remaining_Delay': None, 'Slave_SQL_Running_State': 'Slave has read all relay log; waiting for more updates', 'Master_Retry_Count': 86400, 'Master_Bind': '', 'Last_IO_Error_Timestamp': '', 'Last_SQL_Error_Timestamp': '', 'Master_SSL_Crl': '', 'Master_SSL_Crlpath': '', 'Retrieved_Gtid_Set': '', 'Executed_Gtid_Set': '', 'Auto_Position': 0, 'Replicate_Rewrite_DB': '', 'Channel_Name': '', 'Master_TLS_Version': ''}
mysql: [Warning] Using a password on the command line interface can be insecure.
mysql-s-2 slave status:
{'Slave_IO_State': 'Connecting to master', 'Master_Host': 'mysql-m', 'Master_User': 'slave', 'Master_Port': 3306, 'Connect_Retry': 60, 'Master_Log_File': 'mysql-bin.000003', 'Read_Master_Log_Pos': 1494, 'Relay_Log_File': 'mysql-relay-bin.000001', 'Relay_Log_Pos': 4, 'Relay_Master_Log_File': 'mysql-bin.000003', 'Slave_IO_Running': 'Connecting', 'Slave_SQL_Running': 'Yes', 'Replicate_Do_DB': '', 'Replicate_Ignore_DB': '', 'Replicate_Do_Table': '', 'Replicate_Ignore_Table': '', 'Replicate_Wild_Do_Table': '', 'Replicate_Wild_Ignore_Table': '', 'Last_Errno': 0, 'Last_Error': '', 'Skip_Counter': 0, 'Exec_Master_Log_Pos': 1494, 'Relay_Log_Space': 154, 'Until_Condition': 'None', 'Until_Log_File': '', 'Until_Log_Pos': 0, 'Master_SSL_Allowed': 'No', 'Master_SSL_CA_File': '', 'Master_SSL_CA_Path': '', 'Master_SSL_Cert': '', 'Master_SSL_Cipher': '', 'Master_SSL_Key': '', 'Seconds_Behind_Master': None, 'Master_SSL_Verify_Server_Cert': 'No', 'Last_IO_Errno': 0, 'Last_IO_Error': '', 'Last_SQL_Errno': 0, 'Last_SQL_Error': '', 'Replicate_Ignore_Server_Ids': '', 'Master_Server_Id': 0, 'Master_UUID': '', 'Master_Info_File': '/var/lib/mysql/master.info', 'SQL_Delay': 0, 'SQL_Remaining_Delay': None, 'Slave_SQL_Running_State': 'Slave has read all relay log; waiting for more updates', 'Master_Retry_Count': 86400, 'Master_Bind': '', 'Last_IO_Error_Timestamp': '', 'Last_SQL_Error_Timestamp': '', 'Master_SSL_Crl': '', 'Master_SSL_Crlpath': '', 'Retrieved_Gtid_Set': '', 'Executed_Gtid_Set': '', 'Auto_Position': 0, 'Replicate_Rewrite_DB': '', 'Channel_Name': '', 'Master_TLS_Version': ''}
```
when we insert data to master we check that it also replicated:
```python
for i in range(1, 10):
    insert_primary(i)

print('data on primary')
print_select_events(con_primary)

print('data on s1')
print_select_events(con_s1)

print('data on s2')
print_select_events(con_s2)
```
Output:
```
data on primary
[{'id': 1, 'name': 'some-event-0', 'counter': 0, 'description': 'some-descr-0'}, {'id': 2, 'name': 'some-event-1', 'counter': 1, 'description': 'some-descr-1'}, {'id': 3, 'name': 'some-event-2', 'counter': 2, 'description': 'some-descr-2'}, {'id': 4, 'name': 'some-event-3', 'counter': 3, 'description': 'some-descr-3'}, {'id': 5, 'name': 'some-event-4', 'counter': 4, 'description': 'some-descr-4'}, {'id': 6, 'name': 'some-event-5', 'counter': 5, 'description': 'some-descr-5'}, {'id': 7, 'name': 'some-event-6', 'counter': 6, 'description': 'some-descr-6'}, {'id': 8, 'name': 'some-event-7', 'counter': 7, 'description': 'some-descr-7'}, {'id': 9, 'name': 'some-event-8', 'counter': 8, 'description': 'some-descr-8'}, {'id': 10, 'name': 'some-event-9', 'counter': 9, 'description': 'some-descr-9'}]
data on s1
[{'id': 1, 'name': 'some-event-0', 'counter': 0, 'description': 'some-descr-0'}, {'id': 2, 'name': 'some-event-1', 'counter': 1, 'description': 'some-descr-1'}, {'id': 3, 'name': 'some-event-2', 'counter': 2, 'description': 'some-descr-2'}, {'id': 4, 'name': 'some-event-3', 'counter': 3, 'description': 'some-descr-3'}, {'id': 5, 'name': 'some-event-4', 'counter': 4, 'description': 'some-descr-4'}, {'id': 6, 'name': 'some-event-5', 'counter': 5, 'description': 'some-descr-5'}, {'id': 7, 'name': 'some-event-6', 'counter': 6, 'description': 'some-descr-6'}, {'id': 8, 'name': 'some-event-7', 'counter': 7, 'description': 'some-descr-7'}, {'id': 9, 'name': 'some-event-8', 'counter': 8, 'description': 'some-descr-8'}, {'id': 10, 'name': 'some-event-9', 'counter': 9, 'description': 'some-descr-9'}]
data on s2
[{'id': 1, 'name': 'some-event-0', 'counter': 0, 'description': 'some-descr-0'}, {'id': 2, 'name': 'some-event-1', 'counter': 1, 'description': 'some-descr-1'}, {'id': 3, 'name': 'some-event-2', 'counter': 2, 'description': 'some-descr-2'}, {'id': 4, 'name': 'some-event-3', 'counter': 3, 'description': 'some-descr-3'}, {'id': 5, 'name': 'some-event-4', 'counter': 4, 'description': 'some-descr-4'}, {'id': 6, 'name': 'some-event-5', 'counter': 5, 'description': 'some-descr-5'}, {'id': 7, 'name': 'some-event-6', 'counter': 6, 'description': 'some-descr-6'}, {'id': 8, 'name': 'some-event-7', 'counter': 7, 'description': 'some-descr-7'}, {'id': 9, 'name': 'some-event-8', 'counter': 8, 'description': 'some-descr-8'}, {'id': 10, 'name': 'some-event-9', 'counter': 9, 'description': 'some-descr-9'}]
```
* check replication is working
```
    $ python feed_data.py
```
Example output:
```
mysql-m count: 6010
mysql-s-1 count: 6010
mysql-s-2 count: 6010
```
* turn off mysql-s-1

```
    $ docker kill l18_mysql-s-1_1
```
When we run our `feed_data.py` but without s1 replicae we'll see:
```
mysql-m count: 7010
mysql-s-1 count: OUT
mysql-s-2 count: 7010
```
But when we start `mysql-s-1` again
```
    $ docker-compose up -d mysql-s-1
```
we'll see that it fethces all data it missed:
```
mysql-m count: 7010
mysql-s-1 count: 7010
mysql-s-2 count: 7010
```
