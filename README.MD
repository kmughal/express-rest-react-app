# Introduction


This is a simple applicaiton which is created using:

- Front end ( React )
- Back end ( Express, You can also run the server by docker file! )
- GraphQl is plugged in
- Hooked in Redis for cache

Mongo db is used as data store.

# SSL

In order to get private key 

`
  openssl req -nodes -new -x509 -keyout server.key -out server.cert
  
`
