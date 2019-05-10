import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import { PostComponents } from "./components/all-posts";
import { InputPostComponent } from "./components/insert-new-post";
import { SigninComponent } from "./components/sign-in";
import { SignupComponent } from "./components/sign-up";
import {LogoutComponent} from "./components/logout";

const DisplayComponentForSignedInUser = Component => {
	const isAuthenticated =
		localStorage.getItem("isAuthenticated") || "false" === String(true);
	if (isAuthenticated) return Component;
	return <p />;
};

const DisplayLoginAction = () =>
	localStorage.getItem("isAuthenticated") === String(true) ? (
		<Link to="/logout"> Logout</Link>
	) : (
		<Link to="/signin">Sign in</Link>
	);

const DisplayComponentForAnonymouseUser = Component =>
	localStorage.getItem("isAuthenticated") === String(false) ? Component : <p />;
console.log(
	"localhost store",
	localStorage.getItem("isAuthenticated")  === String(true)
);
export const App = function() {
	return (
		<Router>
			<section className="top-action">
				{DisplayComponentForAnonymouseUser(<Link to="/signup">Sign up</Link>)}
				<DisplayLoginAction />
			</section>
			<nav>
				<ul>
					<li>
						<Link to="/">Home</Link>
					</li>
					{DisplayComponentForSignedInUser(
						<li>
							<Link to="/all-posts/">All Posts</Link>
						</li>
					)}
					{DisplayComponentForSignedInUser(
						<li>
							<Link to="/add-new-post">Add new post</Link>
						</li>
					)}
				</ul>
			</nav>
			<div>
				<Route exact path="/" component={PostComponents} />
				<Route exact path="/logout" component={LogoutComponent} />
				<Route exact path="/signin" component={SigninComponent} />
				<Route exact path="/signup" component={SignupComponent} />
				<Route path="/all-posts" component={PostComponents} />
				<Route path="/add-new-post" component={InputPostComponent} />
			</div>
		</Router>
	);
};
