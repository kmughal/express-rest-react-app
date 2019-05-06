import * as React from "react";
import { PostService } from "../graphql-services/post-service"
export const EditComponent = props => {
	const style = {
		display: props.editPost ? "block" : "none"
	};
	return (
		<div className="edit-post-container" style={style}>
			<form className="edit-post-form">
				Title: <input id="title" defaultValue={props.post.title} />
				Content: <input id="content" defaultValue={props.post.content} />
				Image: <input type="file" id="image" />
				<input type="hidden" id="id" defaultValue={props.post._id} />
				<input
					type="submit"
					className="action-button"
					onClick={event => {
						const service = new PostService();
						const title = document.getElementById("title").value,
							content = document.getElementById("content").value,
							image = document.getElementById("image").files[0],
							id = document.getElementById("id").value;

						service
							.updatePost(id, title, content, image)
							.then(response => response.json())
							.then(posts => props.postUpdaed(posts.data.editPost))
							.catch(e => console.log(e));
						event.preventDefault();
					}}
				/>
				<button
					className="action-button"
					onClick={event => {
						props.closeModal();
						event.preventDefault();
					}}
				>
					Close
				</button>
			</form>
		</div>
	);
};

// export const EditComponent = (props) => {

// 	return (
// 		<div className="edit-component" style={style}>
//       <form>
// 			<div>
// 				<label htmlFor="title">Title:</label>
// 				<iput type="text" id="title" name="title" />
// 			</div>
// 			<div>
// 				<label htmlFor="title">Content:</label>
// 				<iput type="text" id="content" name="content" />
// 			</div>
// 			<div>
// 				<label htmlFor="image">Image:</label>
// 				<iput type="file" id="image" name="image" />
// 			</div>
// 			<div>
// 				<input type="submit">Update</input>
// 			</div>
// 		</form>
//     </div>
// 	);
// };
