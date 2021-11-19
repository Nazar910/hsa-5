# Task
`Try to imagine Instagram-like service architecture. Work only on news feed, subscriptions, comments and likes + media`

# Diagram
![image](https://user-images.githubusercontent.com/19594637/142654407-70aeb519-617d-4c94-a63f-f36a2e58ac8b.png)



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

## Write Services that process post/subscription/like/comment data by storing it into DB
* subscription service
* likes service
* comments service
* posts service

## Write service: recomendation

This service reads `post/subscription/like/comment` data and adjusts our recomendation graph (prepares some data-view to be read by `feed` service).
For example in case of Kafka as message broker, it can listen to the same topics of
`subscriptions/likes/comments/posts` services with different group id and will get all those events.

## Read service: feed

This service reads recomendation view for current user, fetches appropriate posts and returns paginated results (media represented as links to CDN)

# Bottlenecks
* Web-server - this component should be strong enough to handle high load
* gateway - same as web-server
* Message broker - in case of weak message processing data will be processed with big delays
* databases

# SPOF

* Web-server - in case of our web-server outage
* gateway - no requests will be processed without gateway except of loading media
* databases - in case of databases outage and empty cache

# Conclusion

It seems like for this it would be appropriate to combine architecture patterns:

* using gRPC for Read requests (Read req -> web-server -> gateway -> feed service)
* using Event message processing for Write data since it is approppriate to have some eventual consistency here
