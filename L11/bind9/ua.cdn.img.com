$ORIGIN .
$TTL 3600       ; 1 hour
cdn.img.com           IN SOA  ns1.img.com. hostmaster.img.com. (
                                2          ; serial
                                900        ; refresh (15 minutes)
                                600        ; retry (10 minutes)
                                86400      ; expire (1 day)
                                3600       ; minimum (1 hour)
                                )
$TTL 0  ; 0 seconds
                        NS      ns1.img.com.
                        NS      ns2.img.com.
$TTL 3600       ; 1 hour
                        A       62.76.187.192
