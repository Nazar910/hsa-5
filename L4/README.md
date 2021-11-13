# Purpose
The purpose of this project is to get some experience in stress testing and inspect max perfomance of my customer node app.

# Install

To get up infra and app
```
    $ docker-compose build && docker-compose up -d
```
Start node app (used request straight to node app because kept getting a lot of socker timeout errors making request to docker app)
```
    $ cd app
    $ npm run start:local
```

# Tests

## With simple redis cache

* `siege -c10 -t60s -i --file siege-urls.txt`

```
Lifting the server siege...
Transactions:		      109646 hits
Availability:		      100.00 %
Elapsed time:		       59.19 secs
Data transferred:	        7.11 MB
Response time:		        0.01 secs
Transaction rate:	     1852.44 trans/sec
Throughput:		        0.12 MB/sec
Concurrency:		        9.60
Successful transactions:      109646
Failed transactions:	           0
Longest transaction:	        0.05
Shortest transaction:	        0.00
```


* `siege -c25 -t60s -i --file siege-urls.txt`

![image](https://user-images.githubusercontent.com/19594637/141655267-b5c605d5-a7aa-4f97-a288-0a287ddd123a.png)


* `siege -c50 -t60s -i --file siege-urls.txt`

![image](https://user-images.githubusercontent.com/19594637/141655297-3aed0f9f-afc6-47aa-880d-0e530627132b.png)

* `siege -c100 -t60s -i --file siege-urls.txt`

![image](https://user-images.githubusercontent.com/19594637/141655351-2e7a625a-6b0a-46d0-bc71-754fa1dcb900.png)

* `siege -c150 -t60s -i --file siege-urls.txt`

![image](https://user-images.githubusercontent.com/19594637/141655389-3d47f3b5-6113-4172-8881-5c60ca1f69c4.png)

* `siege -c200 -t60s -i --file siege-urls.txt`

![image](https://user-images.githubusercontent.com/19594637/141655429-e394849c-c94d-42d2-b352-f67e928dec02.png)

* `siege -c250 -t60s -i --file siege-urls.txt`

![image](https://user-images.githubusercontent.com/19594637/141653957-78d2ce36-5628-4330-a751-e6baeb13aaec.png)

And my investigations stopped here because of siege limit to 255 concurrent user :)


