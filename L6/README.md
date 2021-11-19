# Task
`Try to imagine Instagram-like service architecture. Work only on news feed, subscriptions, comments and likes + media`

# Diagram
![image](https://user-images.githubusercontent.com/19594637/142651301-39c93233-15dd-489f-8ae4-5899e78c52cd.png)

# Explanation

In following architecture system was splitted into Write and Read service groups.
It is important for app to continue serving Read request event when some of the Write functionality has lag or event outage.

## Web-server

Web server will be used to handle traffic, do light caching + HTTP useful stuff like compressing responses and etc.
Apart of all that its main purpose will be to proxy requests to gateway service.

## Gateway

This service will do auth check and route requests for further processing. Some of the routes:

* media loading - gateway will proxy request to some CDN service to store user media
* Read requests - will send grpc request to feed service and wait for its response
* Write requests - will publish message to Message broker for further processing

## Services that process Write post/subscription/like/comment data by storing it into DB
* subscription service
* likes service
* comments service
* posts service

## Actualizer service
