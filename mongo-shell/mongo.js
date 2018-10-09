db = db.getSiblingDB('intuitiv')

db.createCollection('scope')

db.scope.insertMany([{ 
    "_id" : "basic", 
    "name" : "basic", 
    "description" : "basic", 
    "__v" : NumberInt(0)
},
{ 
    "_id" : "read", 
    "name" : "read", 
    "description" : "read scope", 
    "__v" : NumberInt(0)
}])

db.createCollection('role')

db.role.insertMany([{ 
    "_id" : ObjectId("5bbd1b38f21a393e74b34314"), 
    "name" : "Adminstrator", 
    "description" : "Administrators", 
    "__v" : NumberInt(0)
}])


db.createCollection('user')

db.user.insertMany([{ 
    "_id" : ObjectId("5bbd1c7b4cf1d73778d8baa2"), 
    "role" : [
        "Adminstrator"
    ], 
    "username" : "Administrator", 
    "email" : "aferlim@gmail.com", 
    "password" : "$2a$05$/gcgu0rsUtMQGZL2yvRtouBHaPK3ovRiYxbPtQMmPyAdBGLpHmJue", 
    "created" : ISODate("2018-10-09T21:24:11.142+0000"), 
    "__v" : NumberInt(0)
}]
)

db.createCollection('client')

db.client.insertMany([{ 
    "_id" : ObjectId("5bbd1c5d4cf1d73778d8baa1"), 
    "scope" : [
        {
            "_id" : "basic", 
            "name" : "basic", 
            "description" : "basic", 
            "__v" : NumberInt(0)
        }, 
        {
            "_id" : "read", 
            "name" : "read", 
            "description" : "read scope", 
            "__v" : NumberInt(0)
        }
    ], 
    "name" : "DefaultClient", 
    "secret" : "123456", 
    "admin" : "1", 
    "redirectUri" : "http://localhost:3000", 
    "created" : ISODate("2018-10-09T21:23:41.184+0000"), 
    "__v" : NumberInt(0)
}])

db.createCollection('accessToken')
db.createCollection('authorizationCode')
db.createCollection('refreshToken')