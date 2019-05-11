import React, { useState, useEffect } from "react";
// import * as Socket from "socket.io-client";
import { PostService } from "../graphql-services/post-service"
import { EditComponent } from "./edit-post";

const service = new PostService();

export class PostComponents extends React.Component {
	constructor() {
		super();
		this.state = {
			posts: [],
			editPost: false,
			selectedPost: { title: "", content: "" }
		};
		this.getPosts();
		// const io = Socket("http://localhost:8000/");
		// io.on("posts", data => {
		// 	console.log(data);
		// 	this.setState({ posts: data.posts });
		// });
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
		service
			.deletePost(post._id)
			//.then(res => res.text())
			.then(posts => {
				self.postUpdaed(posts);
			});
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
		
		this.setState({
			posts,
			editPost: false,
			selectedPost: { title: "", content: "" }
		});
	}

	render() {
		const posts = this.state.posts;
		if (posts == null) return(<p>Empty posts</p>)
		const postsMarkup =
			!posts && posts.length === 0 ? (
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
							<img src={image} />
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
			<section className="all-posts">
				<EditComponent
					editPost={this.state.editPost}
					post={this.state.selectedPost}
					closeModal={() => this.discardEdit()}
					postUpdaed={posts => {
						this.postUpdaed(posts);
					}}
				/>
				{postsMarkup}
			</section>
		);
	}
}
