const SERVICE_URL = "http://localhost:8000/graphql";

export class PostService {
	async getAllPosts() {
		const query = {
			query: `{
			getPosts{
				title
				content
				image,
				_id
			}
		}`
		};
		const options = {
			method: "POST",
			body: JSON.stringify(query),
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + localStorage.getItem("token")
			}
		};

		const response = await fetch(SERVICE_URL, options);
		const data = await response.json();
		console.log(data);
		return data.data.getPosts;
	}

	deletePost(id) {
		const data = new FormData();
		data.append("id", id);
		return fetch(SERVICE_URL, {
			method: "DELETE",
			body: data,
			headers: {
				Authorization: "Bearer " + localStorage.getItem("token")
			}
		});
	}

	updatePost(id, title, content, image) {
  
		return this.uploadImage(image)
		.then(res => res.json())
		.then(data => data.data.filePath)
		.then(imageUrl => {
		 
			const query = {
				query : `mutation {
				  editPost(id:"${id}", title :"${title}" ,content :"${content}" , imageUrl :"${imageUrl}") {
						title
					}
				}`
			}

			 
			return fetch(SERVICE_URL, {
				body: JSON.stringify(query),
				method: "POST",
				headers: {
					"CONTENT-TYPE" : "application/json",
					Authorization: "Bearer " + localStorage.getItem("token")
				}
			});
		})
	}


	uploadImage(image) {
		const formData = new FormData();
		formData.append("image", image);
		return fetch("http://localhost:8000/upload-image", {
			method: "PUT",
			body: formData,
			headers: {
				Authorization: "Bearer " + localStorage.getItem("token")
			}
		});
	}

	createPost(title, content, image) {
		return this.uploadImage(image)
			.then(res => {
				window.d = res;
				return res.json();
			})
			.then(data => {
				return data.data.filePath;
			})

			.then(imagePath => {
				const query = {
					query: `
				mutation {
					createPost(title:"${title}" , content:"${content}", imageUrl : "${imagePath}") {
						title,
						content,
						image,
						_id
					}
				}
				`
				};
				return fetch(SERVICE_URL, {
					method: "POST",
					headers: {
						"content-type": "application/json",
						Authorization: "Bearer " + localStorage.getItem("token")
					},
					body: JSON.stringify(query)
				});
			})
			;

		// const data = new FormData();
		// data.append("title", title);
		// data.append("content", content);
		// data.append("image", image);

		// return fetch(SERVICE_URL, {
		// 	body: data,
		// 	method: "POST",
		// 	headers: {
		// 		Authorization: "Bearer " + localStorage.getItem("token")
		// 	}
		// });
		// return fetch(SERVICE_URL, {
		// 	body: JSON.stringify({ title, content }),
		// 	method: "POST",
		// 	headers: { "Content-Type": "application/json" }
		// });
	}
}
