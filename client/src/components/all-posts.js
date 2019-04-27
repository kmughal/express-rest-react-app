import React, { useState, useEffect } from "react";

import { PostService } from "../services/post-service";
import { EditComponent } from "./edit-post";

const service = new PostService();

// export const PostComponents = () => {
// 	const [posts, setPosts] = useState(Î{posts : []});

// 	useEffect(async () => {
//     const result = await service.getAllPosts();
//     console.log(result)
// 		setPosts(result);
//   });

// 	console.log(posts);
// 	return <div>hello world</div>;
// };

// export const PostComponents = () => {

// 	return <div>hello world</div>;
// };

export class PostComponents extends React.Component {
	constructor() {
		super();
		this.state = {
			posts: [],
			editPost: false,
			selectedPost: { title: "", content: "" }
		};
		this.getPosts();
	}

	getPosts() {
		const service = new PostService();
		service.getAllPosts().then(posts => {
			console.log(posts);

			this.setState({
				posts,
				editPost: false,
				selectedPost: { title: "", content: "" }
			});
		});
	}

	editPost(post) {
		const { posts } = this.state;
		this.setState({ posts, editPost: true, selectedPost: post });
	}

	async deletePost(post) {
		const self = this;
		service.deletePost(post._id).then(res => res.text()).then(posts=> {
			self.postUpdaed(posts)
		})
	 
	}

	discardEdit() {
		const { posts } = this.state;
		this.setState({
			posts,
			editPost: false,
			selectedPost: { title: "", content: "" }
		});
	}

	postUpdaed(posts) {
		console.log("posts:",posts)
		this.setState({
			posts:JSON.parse(posts),
			editPost: false,
			selectedPost: { title: "", content: "" }
		});
	}

	render() {
		
		const posts = this.state.posts;
		const postsMarkup =
			posts.length === 0 ? (
				<p>Empty posts</p>
			) : (
				posts.map((post, index) => {
					const image = `http://localhost:8000/${post.image}`;
					return (
						<article key={index}>
							<h1>
								{" "}
								<time>{post.updatedAt}</time> {post.title}
							</h1>
							<p>{post.content}</p>
							<img src={image}/>
							<div>
								<h2>Actions</h2>
								<div className="post-action-buttons">
									<button
										onClick={() => this.editPost(post)}
										className="action-button post-action-buttons__edit"
									>
										Edit
									</button>
									<button
										onClick={() => this.deletePost(post)}
										className="action-button post-action-buttons__delete"
									>
										Delete
									</button>
								</div>
							</div>
						</article>
					);
				})
			);
		return (
			<section>
				<EditComponent
					editPost={this.state.editPost}
					post={this.state.selectedPost}
					closeModal={() => this.discardEdit()}
					postUpdaed ={(posts)=> {this.postUpdaed(posts)}}
				/>
				{postsMarkup}
			</section>
		);
	}
}
