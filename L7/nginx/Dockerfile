FROM nginx:1.15-alpine
RUN  mkdir -p /run/nginx
RUN  apk add --no-cache nginx-mod-http-lua
COPY ./lua/ /etc/lua/
