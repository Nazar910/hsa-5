# Tasks
* create 3 docker containers: postgresql-b, postgresql-b1, postgresql-b2
* setup horizontal sharding as described in lesson
* insert 1M rows
* Measure performance with and without sharding. Compare.

# Prerequisites
* docker-compose up -d
* node
* npm i

# Results
* horizontal harding
To setup horizontal sharding let's use script:
```
    $ npm run setup_sharding
```
* feed 1M rows to main node
```
    $ npm run feed_1M_rows
```
As a result we'll see that 1M of records is splitted between shard nodes:
```
select count(*) from books;
```
on postgesql-b1
```
 count
--------
 500000
```
on postgesql-b2
```
 count
--------
 500000
```
It is normal because `category_id` in seed was computed as `i % 2 + 1`.
Also let's see some example data from each node:
Command: `select * from books order by id limit 20;`
postgresql-b (main node):
```
id | category_id | author  |     title     | year
----+-------------+---------+---------------+------
  0 |           1 | Some-0  | Some-title-0  | 1960
  1 |           2 | Some-1  | Some-title-1  | 1961
  2 |           1 | Some-2  | Some-title-2  | 1962
  3 |           2 | Some-3  | Some-title-3  | 1963
  4 |           1 | Some-4  | Some-title-4  | 1964
  5 |           2 | Some-5  | Some-title-5  | 1965
  6 |           1 | Some-6  | Some-title-6  | 1966
  7 |           2 | Some-7  | Some-title-7  | 1967
  8 |           1 | Some-8  | Some-title-8  | 1968
  9 |           2 | Some-9  | Some-title-9  | 1969
 10 |           1 | Some-10 | Some-title-10 | 1970
 11 |           2 | Some-11 | Some-title-11 | 1971
 12 |           1 | Some-12 | Some-title-12 | 1972
 13 |           2 | Some-13 | Some-title-13 | 1973
 14 |           1 | Some-14 | Some-title-14 | 1974
 15 |           2 | Some-15 | Some-title-15 | 1975
 16 |           1 | Some-16 | Some-title-16 | 1976
 17 |           2 | Some-17 | Some-title-17 | 1977
 18 |           1 | Some-18 | Some-title-18 | 1978
 19 |           2 | Some-19 | Some-title-19 | 1979
```
postgresql-b1 (shard node):
```
 id | category_id | author  |     title     | year
----+-------------+---------+---------------+------
  0 |           1 | Some-0  | Some-title-0  | 1960
  2 |           1 | Some-2  | Some-title-2  | 1962
  4 |           1 | Some-4  | Some-title-4  | 1964
  6 |           1 | Some-6  | Some-title-6  | 1966
  8 |           1 | Some-8  | Some-title-8  | 1968
 10 |           1 | Some-10 | Some-title-10 | 1970
 12 |           1 | Some-12 | Some-title-12 | 1972
 14 |           1 | Some-14 | Some-title-14 | 1974
 16 |           1 | Some-16 | Some-title-16 | 1976
 18 |           1 | Some-18 | Some-title-18 | 1978
 20 |           1 | Some-20 | Some-title-20 | 1980
 22 |           1 | Some-22 | Some-title-22 | 1982
 24 |           1 | Some-24 | Some-title-24 | 1984
 26 |           1 | Some-26 | Some-title-26 | 1986
 28 |           1 | Some-28 | Some-title-28 | 1988
 30 |           1 | Some-30 | Some-title-30 | 1990
 32 |           1 | Some-32 | Some-title-32 | 1992
 34 |           1 | Some-34 | Some-title-34 | 1994
 36 |           1 | Some-36 | Some-title-36 | 1996
 38 |           1 | Some-38 | Some-title-38 | 1998
```
postgreqsl-b2 (shard node):
```
id | category_id | author  |     title     | year
----+-------------+---------+---------------+------
  1 |           2 | Some-1  | Some-title-1  | 1961
  3 |           2 | Some-3  | Some-title-3  | 1963
  5 |           2 | Some-5  | Some-title-5  | 1965
  7 |           2 | Some-7  | Some-title-7  | 1967
  9 |           2 | Some-9  | Some-title-9  | 1969
 11 |           2 | Some-11 | Some-title-11 | 1971
 13 |           2 | Some-13 | Some-title-13 | 1973
 15 |           2 | Some-15 | Some-title-15 | 1975
 17 |           2 | Some-17 | Some-title-17 | 1977
 19 |           2 | Some-19 | Some-title-19 | 1979
 21 |           2 | Some-21 | Some-title-21 | 1981
 23 |           2 | Some-23 | Some-title-23 | 1983
 25 |           2 | Some-25 | Some-title-25 | 1985
 27 |           2 | Some-27 | Some-title-27 | 1987
 29 |           2 | Some-29 | Some-title-29 | 1989
 31 |           2 | Some-31 | Some-title-31 | 1991
 33 |           2 | Some-33 | Some-title-33 | 1993
 35 |           2 | Some-35 | Some-title-35 | 1995
 37 |           2 | Some-37 | Some-title-37 | 1997
 39 |           2 | Some-39 | Some-title-39 | 1999
```
