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
