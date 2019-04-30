const SERVICE_URL = "https://localhost:8000/auth";

export class AuthService {
	signup(name, email, password) {
		const data = new FormData();
		data.append("name", name);
		data.append("email", email);
		data.append("password", password);

		return fetch(`${SERVICE_URL}/signup`, {
			method: "PUT",
			body: data
		});
	}


	signin(email, password) {
		const data = new FormData();
		
		data.append("email", email);
		data.append("password", password);

		return fetch(`${SERVICE_URL}/signin`, {
			method: "POST",
			body: data
		});
	}
}
