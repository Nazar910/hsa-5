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
    $ watch -n 1 'curl -i http://localhost:8080 -w %{time_total}'
```
Normal output:
```
Every 1,0s: curl -i http://localhost:8080 -w %{time_total}

  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
   0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0 100     2  100     2    0     0   2000      0 --:--:-- --:--:-- --:--:--  2000
HTTP/1.1 200 OK
Server: nginx/1.21.4
Date: Tue, 04 Jan 2022 12:45:08 GMT
Content-Type: text/html; charset=utf-8
Content-Length: 2t
Connection: keep-alive
C
Ok0,001719
```


Also we'll monitor docker stats using [TIG stack](https://hackmd.io/@lnu-iot/tig-stack)

## standart nginx config without additional defence

* udp flood

This attack doesn't seem to affect our application (possibly because we're not listening to udp ports :D ).
The only thing we can track is increased amount of incomming traffic to nginx container:
![Screenshot from 2022-01-03 18-21-29](https://user-images.githubusercontent.com/19594637/147954476-4faface4-860d-4d0e-b1b2-3bcc42e3a565.png)


* icmp flood

This attack doesn't seem to work on nginx:1.21/
We can only observe increase traffic on nginx container:
![Screenshot from 2022-01-03 18-35-30](https://user-images.githubusercontent.com/19594637/147955909-0c201d5c-0cc0-4139-986a-9d0f87fbc552.png)


* http flood

Using one kali linux container the only thing I could achieve is to siginficantly increase response times of the application (from 1-2ms in normal to 750ms-1.5sec under load).
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
And our watch curl command results show us that our application was unable to server requests
```
curl: (52) Empty reply from server
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


## nginx with additional defence ([source](https://www.nginx.com/blog/mitigating-ddos-attacks-with-nginx-and-nginx-plus/))

* udp flood

same behaviour as with unprotected nginx

* icmp flood

same behaviour as with unprotected nginx

* http flood

Adding limit_req directive restricts too much request from one ip.
Because of this our siege command failed really early:
```
{	"transactions":			          14,
	"availability":			        1.09,
	"elapsed_time":			        2.69,
	"data_transferred":		        0.24,
	"response_time":		       42.63,
	"transaction_rate":		        5.20,
	"throughput":			        0.09,
	"concurrency":			      221.87,
	"successful_transactions":	          14,
	"failed_transactions":		        1269,
	"longest_transaction":		        0.80,
	"shortest_transaction":		        0.00
}
```
Still we can observe short CPU spikes when we try the attack:
![Screenshot from 2022-01-04 14-56-38](https://user-images.githubusercontent.com/19594637/148062494-60ce1905-fcfb-4fb2-b950-6f648006eacd.png)

BTW we could use something like
```
if ($http_user_agent ~* foo|bar) {
    return 403;
}
```
to completely block known unwanted user-agent.


* slowloris

Adding `limit_con` + `client_body_timeout` and `client_header_timeout` helped to defend from this attack.
```
	slowhttptest version 1.8.2
 - https://github.com/shekyan/slowhttptest -
test type:                        SLOW HEADERS
number of connections:            1050
URL:                              http://nginx:8080/
verb:                             GET
cookie:
Content-Length header value:      4096
follow up data max size:          52
interval between follow up data:  10 seconds
connections per seconds:          200
probe connection timeout:         3 seconds
test duration:                    240 seconds
using proxy:                      no proxy

Tue Jan  4 13:43:58 2022:
slow HTTP test status on 10th second:

initializing:        0
pending:             0
connected:           184
error:               0
closed:              866
service available:   YES
Tue Jan  4 13:43:59 2022:
Test ended on 11th second
Exit status: No open connections left
CSV report saved to slowhttp.csv
HTML report saved to slowhttp.html
```

* syn flood

same behaviour as with unprotected nginx



# Conclusion

In this tests we tested several attacks. Most of them only affect number of traffic hitting your nginx (`udp`, `icmp`, `syn flood`). For example since we're not listening udp ports, we're not affected at all by `udp flood`.
But at the same time, we should be affected by `icmp` or `syn`. Possible reason could be that `nginx:1.21` already protected from such attacks (by os, or default nginx params).

Nevertheless, we find out that we experience increased load while `http flood`. In case the attacker is one machine, we quite easily can protect ourselves by `limit_req` directive to limit max requests rate from one ip.
But in case we'll be DDOS-ed by a high number of devices, we should have also `cache` + some resource capacity or auto-scalling.

And finally, we find out the most dangerous attack - `Slowloris attack`. This one is kinda tricky, because it doesn't seem to be recognizable by resource metrics but strong enough to DOS us. The solution for us is
to limit max connection from one ip (`limit_con`) and set up timeouts for getting req body and headers (`client_body_timeout`, `client_header_timeout`).
