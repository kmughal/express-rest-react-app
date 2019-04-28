var { buildSchema } = require('graphql');

var schema = buildSchema(`

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

  type SignInResult { 
    token : String
    name : String
  }

  type InputSignIn {
    email: String!
    password: String!
  }

  type RootMutation { 
    createUser(registerUserRequest: RegisterUser) : User!
    createPost(title:String!,content:String!,imageUrl:String!) : [Post]
  }

  type Post { 
    _id : ID
    title : String!
    content : String!
    image : String
  }


  type RootQuery { 
    signIn(email:String!,password:String!) : SignInResult!
    getPosts: [Post]
  }

  schema  {
    mutation : RootMutation,
    query : RootQuery
  }
`);

exports.Schema = schema;