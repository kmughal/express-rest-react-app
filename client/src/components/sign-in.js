import * as React from "react";
import { AuthService } from "../services/auth-service";

export class SigninComponent extends React.Component {
	constructor() {
		super();
		this.state = { email: "", password: "", errorsOccured: false, errors: [] , sendRequest : false };
		this.authService = new AuthService();
	}

	handleChange = event => {
		this.setState({
			[event.target.id]: event.target.value
		});
	};

	formIsNotValid = _ =>
		this.state.email.trim().length === 0 ||
		this.state.password.trim().length === 0;

	handleSubmit = e => {
    this.setState({sendRequest : true})
		this.authService
			.signin(this.state.email, this.state.password)
			.then(res => {
				if (res.status >= 400) {
					// bad request
					this.setState({ errorsOccured: true, errors: [] });
				} else if (res.status === 200) {
					this.setState({ errorsOccured: false, errors: [] });
				}
				return res.json();
			})
			.then(data => {
			 
				if (this.state.errorsOccured) {
					this.setState({ errors: data });
				} else {
					if (data.token) {
						localStorage.setItem("token" , data.token);
						this.props.history.push("/all-posts");
					}
				}
			})
			.catch(e => console.log("Sign in failed.", e));
		e.preventDefault();
	};

	render() {
		 
		let signinResponse = <p />;
		if (this.state.errorsOccured) {
			signinResponse = (
				<ul>
					{this.state.errors.map((e, i) => (
						<li key={i}>{e}</li>
					))}
				</ul>
			);
		} else {
      if (this.state.sendRequest) signinResponse = <p>Success</p>
    }
		return (
			<div>
        {signinResponse}
				<form onSubmit={this.handleSubmit}>
					<div className="form-control">
						<label>Email:</label>
						<input type="email" id="email" onChange={this.handleChange} />
					</div>
					<div className="form-control">
						<label>Password:</label>
						<input type="text" id="password" onChange={this.handleChange} />
					</div>
					<div className="action-buttons">
						<button disabled={this.formIsNotValid()}>Signin</button>
					</div>
				</form>
			</div>
		);
	}
}
