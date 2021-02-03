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
                res.json({ success: true, data: rows[0] });
                // res.json(rows[0]);
            }
        );
    } else {
        res.json({ success: false });
    }
});

app.get("/popup/:id", (req, res) => {
    let { id } = req.params;
    db.getInfoPopup(id)
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch((err) => {
            console.log("there was an error: ", err);
        });
});

app.get("/loadmore/:smallestId", (req, res) => {
    let { smallestId } = req.params;
    // console.log("smallestid: ", smallestId);

    // console.log("id: ", smallestId);
    db.getLastImageId(smallestId)
        .then(({ rows }) => {
            res.json(rows);
            // console.log("lowestid: ", rows[0].lowestId);
        })
        .catch((err) => {
            console.log("error in loading more results", err);
        });
});

app.get("/comments/:imageId", (req, res) => {
    console.log("I am the comment route");
    let { id } = req.params;

    db.getAllComments(id)
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch((err) => {
            console.log("error in get all coments: ", err);
        });
});

app.post("/comments", (req, res) => {
    const { comment, username, id } = req.body;

    db.insertComment(comment, username, id)
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch((err) => {
            console.log("error in insert coment: ", err);
        });
});

//make a get request to receive all data based on id of image

app.get("/*", (req, res) => res.redirect("/"));

app.listen(8080, () => console.log("IB server is listening..."));
