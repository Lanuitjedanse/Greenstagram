const express = require("express");
const app = express();
const db = require("./db");
const s3 = require("./s3");
const config = require("./config");
const basicAuth = require("basic-auth");
//middleware uploader
const { uploader } = require("./upload");
exports.app = app;

let basicUser;
let basicPass;
if (process.env.NODE_ENV == "production") {
    basicUser = process.env.basicUser;
    basicPass = process.env.basicPass;
} else {
    const secrets = require("./secrets");
    basicUser = secrets.basicUser;
    basicPass = secrets.basicPass;
}

const auth = function (req, res, next) {
    const creds = basicAuth(req);
    if (!creds || creds.name != basicUser || creds.pass != basicPass) {
        res.setHeader(
            "WWW-Authenticate",
            'Basic realm="Enter your credentials to see this stuff."'
        );
        res.sendStatus(401);
    } else {
        next();
    }
};

app.use(auth);

app.use(express.static("./public"));
app.use(express.static("./uploads"));
app.use(express.json());

/// middleware added

app.get("/welcome", async (req, res) => {
    try {
        const images = await db.getImages();
        // const likes = await db.getLikes();
        // console.log("images: ", images.rows);

        // res.json({ rowsImages: images.rows, rowsLikes: likes.rows });
        res.json(images);
    } catch (err) {
        console.log("err in welcome: ", err);
    }
});

// db.getImages()
//     .then(({ rows }) => {
//         console.log("rows in welcome: ", rows);
//         return;
//     })
//     .catch((err) => {
//         console.log("err in get images: ", err);
//     });

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    const { title, description, username } = req.body;
    const { filename } = req.file;
    const fullUrl = config.s3Url + filename;

    console.log("inside folder uploads");
    if (req.file) {
        db.uploadImage(fullUrl, username, title, description)
            .then(({ rows }) => {
                // console.log("rows: ", rows);
                res.json({ success: true, data: rows[0] });
                // res.json(rows[0]);
            })
            .catch((err) => {
                console.log("file too big", err);
                res.json({ success: false });
            });
    } else {
        console.log("file too big");
        res.json({ success: false });
    }
});

app.get("/popup/:id", (req, res) => {
    let { id } = req.params;
    console.log("id: ", id);
    db.getInfoPopup(id)
        .then(({ rows }) => {
            // let newDate = [];
            // // console.log(rows[0].username);
            // let dataDate = rows[0].created_at;
            // // console.log("rows[0].created_at.slice(0, 10),", rows[0].created_at);
            // let newDate = dataDate.slice(0, 10);
            // // newDate.push({
            // //     username: rows[0].username,
            // //     comment: rows[0].comment,
            // //     created_at: rows[0].created_at.slice(0, 10),
            // //     id: rows[0].id,
            // rows[0].created_at.replace(rows[0].created_at, newDate);
            // // });
            // console.log(newDate);
            res.json(rows);
        })
        .catch((err) => {
            console.log("there was a get pop image/id: ", err);
            res.json({ success: false });
        });
});

app.get("/loadmore/:smallestId", async (req, res) => {
    let { smallestId } = req.params;
    try {
        const images = await db.getLastImageId(smallestId);
        const likes = await db.getAllTotalLikes();
        console.log("likes: ", likes);
        res.json({ images: images.rows, likes: likes.rows });
    } catch (err) {
        console.log("err in loadmore: ", err);
    }
});

app.get("/comments/:imageId", (req, res) => {
    console.log("I am the comment route");
    let { imageId } = req.params;
    // console.log("id: ", imageId);

    db.getAllComments(imageId)
        .then(({ rows }) => {
            res.json(rows);
            console.log("rows: ", rows);
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

app.get("/likes/:imageId", (req, res) => {
    // console.log("post like route");
    const { imageId } = req.params;
    console.log("imageId: ", imageId);

    db.countLikes(imageId)
        .then(({ rows }) => {
            console.log("rows in get likes: ", rows);
            res.json(rows);
        })
        .catch((err) => {
            console.log("there was an error in get likes: ", err);
        });
});

app.post("/likes/:imageId", (req, res) => {
    const { imageId } = req.params;
    console.log(imageId);

    db.addLike(imageId)
        .then(({ rows }) => {
            // console.log("rows= ", rows);
            console.log("a like was added to DB");
            res.json(rows);
        })
        .catch((err) => {
            console.log("err in adding likes in DB: ", err);
            res.json({ success: false });
        });
});

app.get("/likes", (req, res) => {
    // console.log("imageId: ", imageId);

    db.getAllTotalLikes()
        .then(({ rows }) => {
            console.log("rows in get likes: ", rows);
            res.json(rows);
        })
        .catch((err) => {
            console.log("there was an error in get likes: ", err);
        });
});
// app.post("/delete", (req, res) => {
//     const { id } = req.body;
//     console.log("id: ", id);

//     // db.deleteImage(id)
//     //     .then(({ rows }) => {
//     //         console.log("the file was deleted!");
//     //         console.log("rows: ", rows);

//     //         db.deleteComment(id)
//     //             .then(({ rows }) => {
//     //                 console.log("deleted comments");
//     //                 res.json(rows);
//     //             })
//     //             .catch((err) => {
//     //                 console.log("error in deleting the file! ", err);
//     //                 res.json({ success: false });
//     //             });
//     //     })
//     //     .catch((err) => {
//     //         console.log("error in deleting file!", err);
//     //         res.json({ success: false });
//     //     });

//     Promise.all([db.deleteComment(id), db.deleteImage(id)])
//         .then(({ rows }) => {
//             res.json(rows);
//             console.log("file delete wohooo");
//         })
//         .catch((err) => {
//             console.log("err in promise all : ", err);
//             res.json({ success: false });
//         });
// });

//make a get request to receive all data based on id of image

app.get("/*", (req, res) => res.redirect("/"));

if (require.main == module) {
    app.listen(process.env.PORT || 8080, () => {
        console.log("Server is listening...");
    });
}
