const express = require("express");
const app = express();
const db = require("./db");
const s3 = require("./s3");
const config = require("./config");
//middleware uploader
const { uploader } = require("./upload");
exports.app = app;

app.use(express.static("./public"));
app.use(express.static("./uploads"));
app.use(express.json());

/// middleware added

app.get("/welcome", (req, res) => {
    db.getImages()
        .then(({ rows }) => {
            return res.json(rows);
        })
        .catch((err) => {
            console.log("err in get images: ", err);
        });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    const { title, description, username } = req.body;
    const { filename } = req.file;
    const fullUrl = config.s3Url + filename;

    console.log("inside folder uploads");
    if (req.file) {
        db.uploadImage(fullUrl, username, title, description).then(
            ({ rows }) => {
                // console.log("rows: ", rows);
                res.json(rows[0]);
            }
        );
    } else {
        res.json({ success: false });
    }
});

app.get("/*", (req, res) => res.redirect("/"));

app.listen(8080, () => console.log("IB server is listening..."));
