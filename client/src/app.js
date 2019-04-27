import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import { PostComponents } from "./components/all-posts";
import { InputPostComponent } from "./components/insert-new-post";
import { SigninComponent } from "./components/sign-in";
import { SignupComponent } from "./components/sign-up";

export const App = function() {
	return (
		<Router>
			<section className="top-action">
				<Link to="/signup">Sign up</Link>
				<Link to="/signin">Sign in</Link>
			</section>
			<nav>
				<ul>
					<li>
						<Link to="/">Home</Link>
					</li>
					<li>
						<Link to="/all-posts/">All Posts</Link>
					</li>
					<li>
						<Link to="/add-new-post">Add new post</Link>
					</li>
				</ul>
			</nav>
			<div>
				<Route exact path="/" component={PostComponents} />
				<Route exact path="/signin" component={SigninComponent} />
				<Route exact path="/signup" component={SignupComponent} />
				<Route path="/all-posts" component={PostComponents} />
				<Route path="/add-new-post" component={InputPostComponent} />
			</div>
		</Router>
	);
};
