const SERVICE_URL = "http://localhost:8000/graphql";

export class AuthService {
	signup(name, email, password) {
    const query = { query : `
    mutation {
      createUser(registerUserRequest:{name :"${name}" , email:"${email}",  password :"${password}"}){
        _id
        name
        password
      }
    }
    `}

		return fetch(SERVICE_URL, {
			method: "POST",
      body: JSON.stringify(query),
      headers : {
				"content-type" : "application/json",
				Authorization: "Bearer " + localStorage.getItem("token")
      }
		});
	}


	signin(email, password) {
		const query = JSON.stringify({ query : `
		{
			signIn(email:"${email}",password:"${password}") {
				token
				name
			}
		}
		`});

		return fetch(`${SERVICE_URL}`, {
			method: "POST",
			body: query,
			headers : {
				"content-type" : "application/json",
				Authorization: "Bearer " + localStorage.getItem("token")
      }
		});
	}
}
