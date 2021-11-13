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

![image](https://user-images.githubusercontent.com/19594637/141653592-b888c2bd-edc2-4523-9c9e-d41a24bb4ca8.png)


* `siege -c25 -t60s -i --file siege-urls.txt`

![image](https://user-images.githubusercontent.com/19594637/141653642-9d5bc9a8-1554-4096-81b3-41315a321607.png)


* `siege -c50 -t60s -i --file siege-urls.txt`

![image](https://user-images.githubusercontent.com/19594637/141653699-9a7cdef8-f5f0-43d0-bcf7-623acb33e232.png)

* `siege -c100 -t60s -i --file siege-urls.txt`

![image](https://user-images.githubusercontent.com/19594637/141653772-cb9e6db5-224f-4107-8fd0-a9b168d85015.png)

* `siege -c150 -t60s -i --file siege-urls.txt`

![image](https://user-images.githubusercontent.com/19594637/141653865-74e0e22d-93fa-4289-b3f8-161c9847ad21.png)

* `siege -c200 -t60s -i --file siege-urls.txt`

![image](https://user-images.githubusercontent.com/19594637/141653912-03d92d5a-e937-4112-a112-f234e152a6cf.png)

* `siege -c250 -t60s -i --file siege-urls.txt`

![image](https://user-images.githubusercontent.com/19594637/141653957-78d2ce36-5628-4330-a751-e6baeb13aaec.png)

And my investigations stopped here because of siege limit to 255 concurrent user :)


