const express = require("express");
const app = express();
const multer = require("multer");
const cors = require("cors");
app.use(cors());

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "");
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	},
});

const upload = multer({ storage: storage }).single("file");

app.post("/upload", function (req, res) {
	upload(req, res, function (err) {
		if (err instanceof multer.MulterError) {
			return res.status(500).json(err);
		} else if (err) {
			return res.status(500).json(err);
		}
		return res.status(200).send();
	});
});

app.listen(8000, function () {
	console.log("Server running on port 8000");
});
