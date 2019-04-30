const SERVICE_URL = "https://localhost:8000/posts";

export class PostService {
	async getAllPosts() {
		console.log(localStorage.getItem("token"))
		const options = {
			method: "GET",

			headers: {
				"Content-Type": "application/json",
				'Authorization': 'Bearer ' + localStorage.getItem("token")
			}
		};
		console.log(options);
		const response = await fetch(SERVICE_URL, options);

		const posts = await response.json();
		return posts;
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
		const data = new FormData();
		data.append("id", id);
		data.append("title", title);
		data.append("content", content);
		data.append("image", image);
		// for(let i of data.values()) console.log(i)
		// console.log(title,id,content,image)
		return fetch(SERVICE_URL, {
			body: data,
			method: "PUT",
			headers: {
				Authorization: "Bearer " + localStorage.getItem("token")
			}
		});
	}

	createPost(title, content, image) {
		const data = new FormData();
		data.append("title", title);
		data.append("content", content);
		data.append("image", image);

		return fetch(SERVICE_URL, {
			body: data,
			method: "POST",
			headers: {
				Authorization: "Bearer " + localStorage.getItem("token")
			}
		});
		// return fetch(SERVICE_URL, {
		// 	body: JSON.stringify({ title, content }),
		// 	method: "POST",
		// 	headers: { "Content-Type": "application/json" }
		// });
	}
}
