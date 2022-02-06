# Tasks
* profile bst space usage
* profile bst time consumption

# Prerequisites
* node
* install deps
```
    $ npm install
```

# Space usage
To inspect space usage used `index.js` script with following command:
```
    $ node --inspect-brk index.js
```
which allows us to use Chrome DevTools to do Memory snapshots and etc.

# Time consumption

# Reports script
There is a manual [script](https://github.com/Nazar910/hsa-5/blob/main/L21/generate-reports.js) we can use to track search and time complexity:
```bash
    $ node --expose-gc generate-reports.js
```
Output

```bash
┌─────────┬────────┬─────────────────────────────────┬───────────────────────┐
│ (index) │  size  │ search duration (mean), nanosec │ heap delta (mean), KB │
├─────────┼────────┼─────────────────────────────────┼───────────────────────┤
│    0    │     10 │             1382.24             │         3.65          │
│    1    │    100 │             640.75              │         11.64         │
│    2    │    500 │             821.76              │         11.44         │
│    3    │   1000 │             961.17              │         18.16         │
│    4    │   5000 │             1994.17             │         19.59         │
│    5    │  10000 │             1034.81             │         14.73         │
│    6    │ 100000 │             1432.84             │         30.33         │
└─────────┴────────┴─────────────────────────────────┴───────────────────────┘

```
