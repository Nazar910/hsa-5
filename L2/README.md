## Quick overview

In this case we have following infra:
* influxdb - for storing our metrics
* telegraf - for grabing our metrics
* grafana - for charts
* elasticsearch
* mongodb
* gateway - simple node.js server that accepts POST HTTP routes and sends queries to MongoDB and Elasticsearch

## Charts

![image](https://user-images.githubusercontent.com/19594637/140271211-7ad29111-16d6-4e0a-bd5d-dd869c8f933a.png)
On the Docker tab, we can see CPU, Memory, Networks metrics and etc. On this particular timeframe we see
how much CPU and Memotry were used by our infra.
* Moments of low consumption represent idle time
* Moments of high consumption show us when our benchmark tool was launched

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

## Run benchmark

```
    $ ./run_ab.sh
```
