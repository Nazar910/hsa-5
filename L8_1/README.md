# Task
* test database (MySQL and PostgreSQL) isolation levels against LOST UPDATE, DIRTY READ, NON REPEATABLE READ and PHANTOM read

# Results

## MySQL

### `TRANSACTION LEVEL = READ UNCOMMITTED`

LOST UPDATE not reproduced
```
==========================LOST UPDATE========================
session1: update finished
session2: update finished
=============================================================
[{'id': 211, 'f1': 1, 'f2': 45}, {'id': 212, 'f1': 2, 'f2': 0}]
```

DIRTY READ reproduced
```
==========================DIRTY READ========================
session1: select finished [{'f2': 0}]
session1: update finished
session 2: select finished [{'f2': 1}]
session 2: commit
session 1: rollback
=============================================================
[{'id': 213, 'f1': 1, 'f2': 0}, {'id': 214, 'f1': 2, 'f2': 0}]
```

NON REPEATABLE READ reproduced

```
======================NON REPEATABLE READ======================
session 1: select finished [{'f2': 0}]
session 2: first select finished [{'f2': 0}]
session 1: update finished
session 1: commit
session 2: second select finished [{'f2': 1}]
session 2: commit
=============================================================
[{'id': 215, 'f1': 1, 'f2': 1}, {'id': 216, 'f1': 2, 'f2': 0}]
```

PHANTOM READ reproduced
```
======================PHANTOM READ======================
session 2: first select finished [{'sum(f2)': Decimal('0')}]
session 1: insert finished
session 1: commit
session 2: second select finished [{'sum(f2)': Decimal('20')}]
session 2: commit
=============================================================
[{'id': 217, 'f1': 1, 'f2': 0}, {'id': 218, 'f1': 2, 'f2': 0}, {'id': 219, 'f1': 15, 'f2': 20}]
```

### `TRANSACTION LEVEL = READ COMMITTED`

LOST UPDATE not reproduced
```
==========================LOST UPDATE========================
session1: update finished
session2: update finished
=============================================================
[{'id': 220, 'f1': 1, 'f2': 45}, {'id': 221, 'f1': 2, 'f2': 0}]
```

DIRTY READ not reproduced
```
==========================DIRTY READ========================
session1: select finished [{'f2': 0}]
session1: update finished
session 2: select finished [{'f2': 0}]
session 2: commit
session 1: rollback
=============================================================
[{'id': 222, 'f1': 1, 'f2': 0}, {'id': 223, 'f1': 2, 'f2': 0}]
```

NON REPEATABLE READ reproduced

```
======================NON REPEATABLE READ======================
session 2: first select finished [{'f2': 0}]
session 1: select finished [{'f2': 0}]
session 1: update finished
session 1: commit
session 2: second select finished [{'f2': 1}]
session 2: commit
=============================================================
[{'id': 224, 'f1': 1, 'f2': 1}, {'id': 225, 'f1': 2, 'f2': 0}]
```

PHANTOM READ reproduced
```
======================PHANTOM READ======================
session 2: first select finished [{'sum(f2)': Decimal('0')}]
session 1: insert finished
session 1: commit
session 2: second select finished [{'sum(f2)': Decimal('20')}]
session 2: commit
=============================================================
[{'id': 226, 'f1': 1, 'f2': 0}, {'id': 227, 'f1': 2, 'f2': 0}, {'id': 228, 'f1': 15, 'f2': 20}]
```

### `TRANSACTION LEVEL = REPEATABLE READ`

LOST UPDATE not reproduced
```
==========================LOST UPDATE========================
session1: update finished
session2: update finished
=============================================================
[{'id': 229, 'f1': 1, 'f2': 45}, {'id': 230, 'f1': 2, 'f2': 0}]
```

DIRTY READ not reproduced
```
==========================DIRTY READ========================
session1: select finished [{'f2': 0}]
session1: update finished
session 2: select finished [{'f2': 0}]
session 2: commit
session 1: rollback
=============================================================
[{'id': 231, 'f1': 1, 'f2': 0}, {'id': 232, 'f1': 2, 'f2': 0}]
```

NON REPEATABLE READ not reproduced

```
======================NON REPEATABLE READ======================
session 1: select finished [{'f2': 0}]
session 1: update finished
session 2: first select finished [{'f2': 0}]
session 1: commit
session 2: second select finished [{'f2': 0}]
session 2: commit
=============================================================
[{'id': 233, 'f1': 1, 'f2': 1}, {'id': 234, 'f1': 2, 'f2': 0}]
```

PHANTOM READ not reproduced
```
======================PHANTOM READ======================
session 2: first select finished [{'sum(f2)': Decimal('0')}]
session 1: insert finished
session 1: commit
session 2: second select finished [{'sum(f2)': Decimal('0')}]
session 2: commit
=============================================================
[{'id': 235, 'f1': 1, 'f2': 0}, {'id': 236, 'f1': 2, 'f2': 0}, {'id': 237, 'f1': 15, 'f2': 20}]
```

### `TRANSACTION LEVEL = SERIALIZABLE`

LOST UPDATE not reproduced
```
==========================LOST UPDATE========================
session1: update finished
session2: update finished
=============================================================
[{'id': 274, 'f1': 1, 'f2': 45}, {'id': 275, 'f1': 2, 'f2': 0}]
```

DIRTY READ not reproduced
```
==========================DIRTY READ========================
session1: select finished [{'f2': 0}]
session1: update finished
session 2: select finished [{'f2': 0}]
session 2: commit
session 1: rollback
=============================================================
[{'id': 276, 'f1': 1, 'f2': 0}, {'id': 277, 'f1': 2, 'f2': 0}]
```

NON REPEATABLE READ not reproduced

```
======================NON REPEATABLE READ======================
session 1: select finished [{'f2': 0}]
session 1: update finished
session 1: commit
session 2: first select finished [{'f2': 1}]
session 2: second select finished [{'f2': 1}]
session 2: commit
=============================================================
[{'id': 410, 'f1': 1, 'f2': 1}, {'id': 411, 'f1': 2, 'f2': 0}]
```

PHANTOM READ not reproduced
```
======================PHANTOM READ======================
session 2: first select finished [{'sum(f2)': Decimal('0')}]
session 2: second select finished [{'sum(f2)': Decimal('0')}]
session 2: commit
session 1: insert finished
session 1: commit
=============================================================
[{'id': 412, 'f1': 1, 'f2': 0}, {'id': 413, 'f1': 2, 'f2': 0}, {'id': 414, 'f1': 15, 'f2': 20}]
```

## PostgreSQL

### `TRANSACTION LEVEL = READ UNCOMMITTED`

LOST UPDATE not reproduced
```
==========================LOST UPDATE========================
session1: update finished
session2: update finished
=============================================================
[(20, 2, 0), (19, 1, 45)]
```

DIRTY READ not reproduced
```
==========================DIRTY READ========================
session1: select finished [(0,)]
session1: update finished
session 2: select finished [(0,)]
session 2: commit
session 1: rollback
=============================================================
[(21, 1, 0), (22, 2, 0)]
```

NON REPEATABLE READ reproduced

```
======================NON REPEATABLE READ======================
session 1: select finished [(0,)]
session 1: update finished
session 2: first select finished [(0,)]
session 1: commit
session 2: second select finished [(1,)]
session 2: commit
=============================================================
[(24, 2, 0), (23, 1, 1)]
```

PHANTOM READ reproduced
```
======================PHANTOM READ======================
session 2: first select finished [(0,)]
session 1: insert finished
session 1: commit
session 2: second select finished [(20,)]
session 2: commit
=============================================================
[(25, 1, 0), (26, 2, 0), (27, 15, 20)]
```

### `TRANSACTION LEVEL = READ COMMITTED`

LOST UPDATE not reproduced
```
==========================LOST UPDATE========================
session1: update finished
session2: update finished
=============================================================
[(29, 2, 0), (28, 1, 45)]
```

DIRTY READ not reproduced
```
==========================DIRTY READ========================
session1: select finished [(0,)]
session1: update finished
session 2: select finished [(0,)]
session 2: commit
session 1: rollback
=============================================================
[(30, 1, 0), (31, 2, 0)]
```

NON REPEATABLE READ reproduced

```
======================NON REPEATABLE READ======================
session 1: select finished [(0,)]
session 1: update finished
session 2: first select finished [(0,)]
session 1: commit
session 2: second select finished [(1,)]
session 2: commit
=============================================================
[(33, 2, 0), (32, 1, 1)]
```

PHANTOM READ reproduced
```
======================PHANTOM READ======================
session 2: first select finished [(0,)]
session 1: insert finished
session 1: commit
session 2: second select finished [(20,)]
session 2: commit
=============================================================
[(34, 1, 0), (35, 2, 0), (36, 15, 20)]
```

### `TRANSACTION LEVEL = REPEATABLE READ`

LOST UPDATE not reproduced (Got error from PostgreSQL)
```
==========================LOST UPDATE========================
session1: update finished
Process Process-18:
Traceback (most recent call last):
  File "/usr/lib/python3.8/multiprocessing/process.py", line 315, in _bootstrap
    self.run()
  File "/usr/lib/python3.8/multiprocessing/process.py", line 108, in run
    self._target(*self._args, **self._kwargs)
  File "test_postgresql.py", line 71, in session2
    cursor.execute('UPDATE tbl1 SET f2=f2+25 WHERE f1=1;')
psycopg2.errors.SerializationFailure: could not serialize access due to concurrent update

=============================================================
[(38, 2, 0), (37, 1, 20)]
```

DIRTY READ not reproduced
```
==========================DIRTY READ========================
session1: select finished [(0,)]
session1: update finished
session 2: select finished [(0,)]
session 2: commit
session 1: rollback
=============================================================
[(39, 1, 0), (40, 2, 0)]
```

NON REPEATABLE READ not reproduced

```
======================NON REPEATABLE READ======================
session 1: select finished [(0,)]
session 1: update finished
session 2: first select finished [(0,)]
session 1: commit
session 2: second select finished [(0,)]
session 2: commit
=============================================================
[(42, 2, 0), (41, 1, 1)]
```

PHANTOM READ not reproduced
```
======================PHANTOM READ======================
session 2: first select finished [(0,)]
session 1: insert finished
session 1: commit
session 2: second select finished [(0,)]
session 2: commit
=============================================================
[(43, 1, 0), (44, 2, 0), (45, 15, 20)]
```

### `TRANSACTION LEVEL = SERIALIZABLE`

LOST UPDATE not reproduced (Got error from PostgreSQL)
```
==========================LOST UPDATE========================
session2: update finished
Process Process-25:
Traceback (most recent call last):
  File "/usr/lib/python3.8/multiprocessing/process.py", line 315, in _bootstrap
    self.run()
  File "/usr/lib/python3.8/multiprocessing/process.py", line 108, in run
    self._target(*self._args, **self._kwargs)
  File "test_postgresql.py", line 62, in session1
    cursor.execute('UPDATE tbl1 SET f2=f2+20 WHERE f1=1;')
psycopg2.errors.SerializationFailure: could not serialize access due to concurrent update

=============================================================
[(47, 2, 0), (46, 1, 25)]
```

DIRTY READ not reproduced
```
==========================DIRTY READ========================
session1: select finished [(0,)]
session1: update finished
session 2: select finished [(0,)]
session 2: commit
session 1: rollback
=============================================================
[(48, 1, 0), (49, 2, 0)]
```

NON REPEATABLE READ not reproduced

```
======================NON REPEATABLE READ======================
session 1: select finished [(0,)]
session 1: update finished
session 2: first select finished [(0,)]
session 1: commit
session 2: second select finished [(0,)]
session 2: commit
=============================================================
[(51, 2, 0), (50, 1, 1)]
```

PHANTOM READ not reproduced
```
======================PHANTOM READ======================
session 2: first select finished [(0,)]
session 1: insert finished
session 1: commit
session 2: second select finished [(0,)]
session 2: commit
=============================================================
[(52, 1, 0), (53, 2, 0), (54, 15, 20)]
```
