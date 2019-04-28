var { buildSchema } = require('graphql');

var schema = buildSchema(`
  type Post { 
    _id : ID
    title : String!
    content : String!
    image : String
  }

  type User {
    _id :ID
    name: String!
    password : String
    email : String
    status : String
    posts : [Post!]!
  }

  input RegisterUser {
    name: String!
    email: String!
    password: String!
  }
  type RootMutation { 
    createUser(registerUserRequest: RegisterUser) : User!
  }
  type RootQuery { 
    hello :String
  }

  schema  {
    mutation : RootMutation,
    query : RootQuery
  }
`);

exports.Schema = schema;