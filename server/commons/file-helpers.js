exports.deleteImage = async filename => {
	try {
		const absolutePath = require("path").resolve(__dirname, "../" + filename);
		await require("fs").unlink(absolutePath,err => {
			console.log(err)
		})
	} catch (e) {
		console.log("Delete file failed with error e :", e);
	}
};
