intuitiv-identity-server
This project implements all of Oauth2 flows using NodeJs

 docker run -d -p 27017:27017 mongo:4.1
 
 docker run --name redis -p 6379:6379 -d redis
 
 docker run -it --link redis:redis --rm redis redis-cli -h redis -p 6379