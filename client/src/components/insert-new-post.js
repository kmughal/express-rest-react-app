import * as React from "react";
import { PostService } from "../graphql-services/post-service";

const buildErrorStringMarkup = data => {
	if (!data.errors) return "added"
	const errors = data.errors[0].messages;
	const errorHtml = ['<ul class="alert--danger">'];
	errors.forEach(m => errorHtml.push(`<li>${m}</li>`));
	errorHtml.push("</ul>");
	return errorHtml.join("");
};

const updateSubmitResultMarkup = text =>
	document.getElementById("submit--results").innerHTML = text;

	
const sendPost = () => {
	const title = document.getElementById("title").value,
		content = document.getElementById("content").value,
		image = document.getElementById("image").files[0];

	const service = new PostService();
	
	service.createPost(title, content,image).then(response => {
		//const { status } = response;
		//if (status !== 201)
		 {
			response
				.json()
				.then(buildErrorStringMarkup)
				.then(updateSubmitResultMarkup);
		} 
		//else {
		//	updateSubmitResultMarkup("Post added!");
		//}
	});
};

export const InputPostComponent = () => {
	return (
		<form>
			<section>
				<div id="submit--results" />
				<div className="form-control">
					<label htmlFor="title">Title:</label>
					<input type="text" name="title" id="title" />
				</div>
				<div className="form-control">
					<label htmlFor="content">Content:</label>
					<input type="content" name="content" id="content" />
				</div>
				<div className="form-control">
					<label htmlFor="content">Image:</label>
					<input type="file" name="image" id="image" />
				</div>
				<div className="form-control">
					<input className="action-button" type="button" onClick={sendPost} value="Save post" />
				</div>
			</section>
		</form>
	);
};
