const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
const multer = require("multer");
const mongoose = require("mongoose");
const { AuthMiddleware } = require("./middlewares/is-auth");
const cors = require("cors");

// Graph ql
const graphSchema = require("./graphql/schema");
const graphResolver = require("./graphql/resolver");
const expressGraphql = require("express-graphql");

const storage = multer.diskStorage({
	destination: (req, file, cb) => cb(null, "images"),
	filename: (req, file, cb) => cb(null, String(file.originalname))
});

const fileFilter = (req, file, cb) => {
	if (
		(file.mimetype === "image/jpg",
		file.mimetype === "image/jpeg" || file.mimetype === "image/png")
	) {
		cb(null, true);
	}
	cb(null, false);
};

const { postRoutes } = require("./routes/post");
const { authRoutes } = require("./routes/auth");
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(multer({ storage, fileFilter }).single("image"));
app.use("/images", express.static(path.resolve(__dirname, "images")));


app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "OPTIONS,GET,POST,PUT,DELETE");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
	if (req.method === "OPTOINS") {
		return res.sendStatus(200);
	}
	next();
});

app.use(AuthMiddleware);

app.use(
	"/graphql",
	expressGraphql({
		schema: graphSchema.Schema,
		rootValue: graphResolver.Root,
		graphiql: true,
		customFormatErrorFn(err) {
			
			if (!err.originalError) {
				throw err;
			}
			const messages = [err.originalError.message || "Error has occured"];
			const statusCode = 500;

			return { messages, statusCode };
		}
	})
);



// app.use("/posts", AuthMiddleware, postRoutes);
// app.use("/auth", authRoutes);

app.use((error, req, res, next) => {
	console.log(error);
	error.statusCode = error.statusCode || 500;
	res.status(error.statusCode).json(error.messages || ["Error has occured!"]);
});

// In conjuction with GraphQL
app.put("/upload-image" , async(req,res,next) => {
	console.log("in upload")
	if (!req.isAuth) throw new Error("Not authenticated");
	if (!req.file) return new next(new Error("no file attached"));
	console.log(req.file.path)
	res.status(200).json({ message : "image uploaded successfully" , data : { filePath : req.file.path} });
})

const { dburl } = require("./settings");
const SERVER_PORT = 8000;

mongoose
	.connect(dburl, { useNewUrlParser: true })
	.then(v => {
		const server = app.listen(SERVER_PORT, () =>
			console.log(
				"started server at port # ,",
				SERVER_PORT,
				new Date().toISOString()
			)
		);
		// const {IoFactory} = require("./infrastructure/io-factory")
		// IoFactory.init((server));
		// const io = IoFactory.get();

		// io.on("connect" , listner=> {
		// 	console.log(listner)
		// })
		// io.on("connection", listner=> {
		// 	console.log("connected");
		// })
	})
	.catch(e => console.log("Error: ", e));
