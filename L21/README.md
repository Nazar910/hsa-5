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
To inspect space usage used `inspect-memory.js` script with following command:
```
    $ node --inspect-brk inspect-memory.js
```
which allows us to use Chrome DevTools to do Memory snapshots and etc.
* dataset size = 10
![image](https://github.com/Nazar910/hsa-5/blob/main/L21/screenshots/Node.size10.png?raw=true)
* dataset size = 100
![image](https://github.com/Nazar910/hsa-5/blob/main/L21/screenshots/Node.size100.png?raw=true)
* dataset size = 500
![image](https://github.com/Nazar910/hsa-5/blob/main/L21/screenshots/Node.size500.png?raw=true)

So space complexity for the bst alog we've used is about `O(n)`.

# Time consumption
To inspect time conumption used `inspect-time.js` script which starts server running `search` on GET.
`siege` cmd used to load `GET /`:
```
    $ siege -c1 -t30s http://localhost:8080
```
Cmd to run server:
```
    $ node --inspect inspect-time.js
```
After starting server, Chrome Dev Tools profiling were launched to track function timings.
Results:
* size 10
![image](https://github.com/Nazar910/hsa-5/blob/main/L21/screenshots/TreeBase.find.size10.png?raw=true)
* size 10_000
![image](https://github.com/Nazar910/hsa-5/blob/main/L21/screenshots/TreeBase.find.size10k.png?raw=true)
* size 100_000
![image](https://github.com/Nazar910/hsa-5/blob/main/L21/screenshots/TreeBase.find.size100k.png?raw=true)

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
