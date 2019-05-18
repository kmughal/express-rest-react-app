const express = require("express");
const path = require("path");

const app = express();
app.use(express.static(path.resolve(__dirname, "build")));

app.get("*", (req, res) => {
	const indexHtml = path.resolve(__dirname, "build", "index.html");
	res.sendFile(indexHtml);
});

const port = process.env.CLIENT_PORT || 3000;
app.listen(port, () => {
	console.log("client connected at ", port);
});
