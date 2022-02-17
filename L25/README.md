# Tasks
* create autoscale group that will contain 1 on-demand instance and will scale with spot instances
* set up scaling policy based on AVG CPU usage
* set up scaling policy based on requests amount that allows non-linear growth

# Setup

* prepare instance (simple Ubuntu server with Nginx installed)
* create target group
![image](https://github.com/Nazar910/hsa-5/blob/main/L25/images/create-target-group.png?raw=true)
* configure load balancing
![image](https://github.com/Nazar910/hsa-5/blob/main/L25/images/configure-lb.png?raw=true)
* create AMI of that instance
![image](https://github.com/Nazar910/hsa-5/blob/main/L25/images/create-ami.png?raw=true)
* create launch template
![image](https://github.com/Nazar910/hsa-5/blob/main/L25/images/create-launch-template.png?raw=true)
* create autoscale config
    * attach to existing lb
![image](https://github.com/Nazar910/hsa-5/blob/main/L25/images/attach-autoscale-to-existing-lb.png?raw=true)
    * configure group size (specify minimun instances 1 and max instances to 3 for our case)
![image](https://github.com/Nazar910/hsa-5/blob/main/L25/images/group-size.png?raw=true)
    * specify appropriate proportion of On-Demand|Spot instances for the best price for value
![image](https://github.com/Nazar910/hsa-5/blob/main/L25/images/instance-purchase-options.png?raw=true)
    * specify dynamic scaling policy baseed on AVG CPU usage:
![image](https://github.com/Nazar910/hsa-5/blob/main/L25/images/scaling-policy-based-on-cpu.png?raw=true)

When the autoscale config is created we should see success message in the activity bar:
![image](https://github.com/Nazar910/hsa-5/blob/main/L25/images/success-message.png?raw=true)

# Benchmark

In order to load our instances the following command will be used:
```
    $ siege -c100 -t20m test-lb-1084918617.us-east-1.elb.amazonaws.com
```
