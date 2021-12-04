# Task

* Prepare Mysql db with 40m users
* Test select perfomance by date:
  * without index
  * with B-tree index
  * with HASH index
* try different options of `innodb_flush_log_at_trx_commit` param and monitor insert perfomance
