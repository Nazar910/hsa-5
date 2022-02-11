# Tasks
* set up 2 ec2 t2.micro instances
* set up LB
* test that LB works

# Set up
* create AWS account
* create 2 t2.micro instances

TODO: paste link to media/instances.png

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
Node: app1.js and app2.js differs with response: app1 respond with `{"data":"Hello from app 1!"}` and app2 respond with `{"data":"Hello from app 2!"}`.
* set up classic LB (see healthcheck screenshot)

TODO: pase link to media/healthchecks.png

* set up security groups configs to allow
  * inbound traffic to loadbalancer
  * traffic from loadbalancer to instances

TODO: paste link to media/lb-metrics.png

# Results

Using command:
```
    $ curl test-lb-72930514.us-east-1.elb.amazonaws.com
```

TODO: paste link to media/aws-lb-example.gif

We see that we hit different instances
