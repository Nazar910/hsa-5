## Get containers running

In the best scenaria you can just use:

```
    $ GID=$GID docker-compose up -d
```

If you get Grafana exiting with code 1, check whether you have correct permissions.
Example error in Grafana:
```
mkdir: can't create directory '/var/lib/grafana/plugins': Permission denied
```
If this is your error you can easily fix this by
```
sudo chown 472:472 -R ./data/grafana
```

## Set up Grafana

* Set up InfluxDb data source
* Import telegraf dashboard by link https://grafana.com/grafana/dashboards/61
