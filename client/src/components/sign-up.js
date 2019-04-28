import * as React from "react";
import { AuthService } from "../graphql-services/auth-service";


export class SignupComponent extends React.Component {
	constructor() {
		super();
		this.state = {
			email: "",
			password: "",
			name: "",
			accountCreated: false,
			errorOccured: false,
			errors: []
		};
		this.signin = this.signin.bind(this);
		this.authService = new AuthService();
	}

	signin() {}

	handleChange = event => {
		this.setState({
			[event.target.id]: event.target.value
		});
	};

	validateForm() {
		return (
			String(this.state.email).trim().length > 0 &&
			String(this.state.password).trim().length > 0 &&
			String(this.state.name).trim().length > 0
		);
	}

	handleSubmit = event => {
		this.authService
			.signup(this.state.name, this.state.email, this.state.password)
			.then(res => {
				console.log(res);
				if (res.status === 200) {
					this.setState({
						accountCreated: true,
						errorOccured: false,
						errors: []
					});
				} else {
					this.setState({
						accountCreated: false,
						errorOccured: true,
						errors: []
					});
				}

				return res.json();
			})
			.then(data => {
				console.log(data);
			  window.data = data
				if (!this.state.accountCreated) {
					const errors = data.errors[0].messages;
					console.log(errors)
					this.setState({ errors: errors });
					console.log(this.state);
				}
			})
			.catch(e => console.log("auth service failed, ", e));
		event.preventDefault();
	};


	render() {
		let errorResults = <p></p>
		if (this.state.errorOccured) {
			console.log(this.state.errors, this.state.errors.map);
		  errorResults = (<ul>
					{this.state.errors.map((err, key) => (
						<li key={key}>{err}</li>
					))}
			</ul> );
		} else {
			if (this.state.accountCreated) errorResults = <p>Account created !</p>
		}
		return (
			<section>
				{errorResults}
				<form onSubmit={this.handleSubmit}>
					<div className="form-control">
						<label>Name:</label>
						<input
							type="text"
							name="name"
							onChange={this.handleChange}
							id="name"
						/>
					</div>
					<div className="form-control">
						<label>Email:</label>
						<input
							type="email"
							name="email"
							id="email"
							onChange={this.handleChange}
						/>
					</div>
					<div className="form-control">
						<label>Password:</label>
						<input
							type="text"
							name="password"
							id="password"
							onChange={this.handleChange}
						/>
					</div>
					<div className="action-buttons">
						<button
							className="action-button action-buttons__signin"
							onClick={this.signin}
							disabled={!this.validateForm()}
						>
							Signin
						</button>
					</div>
				</form>
			</section>
		);
	}
}
