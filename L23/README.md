# Tasks
* set up 2 ec2 t2.micro instances
* set up LB
* test that LB works

# Set up
* create AWS account
* create 2 t2.micro instances

![image](https://github.com/Nazar910/hsa-5/blob/main/L23/media/instances.png?raw=true)

* install node for both
```
    $ sudo apt-get update
    $ sudo apt-get install -y nodejs
```
* set up node app
```
    $ touch app.js
    $ vim app.js # paste code from either app1.js or app2.js
    $ node app.js &
```

Whole node.js script is as simple as it can be:
```javascript
const http = require('http');

const server = http.createServer((req, res) => {
    switch (req.url) {
        case '/health':
            res.writeHead(200);
            res.end();
            break;
        default:
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                data: 'Hello from app 1!'
            }));
    }
});

server.listen(8000);

```

Node: app1.js and app2.js differs with response: app1 respond with `{"data":"Hello from app 1!"}` and app2 respond with `{"data":"Hello from app 2!"}`.

* set up classic LB (see healthcheck screenshot)

![image](https://github.com/Nazar910/hsa-5/blob/main/L23/media/healthchecks.png?raw=true)

* set up security groups configs to allow
  * inbound traffic to loadbalancer
  * traffic from loadbalancer to instances

![image](https://github.com/Nazar910/hsa-5/blob/main/L23/media/lb-metrics.png?raw=true)

# Results

Using command:
```
    $ curl test-lb-72930514.us-east-1.elb.amazonaws.com
```

![image](https://github.com/Nazar910/hsa-5/blob/main/L23/media/aws-lb-example.gif?raw=true)

We see that we hit different instances
