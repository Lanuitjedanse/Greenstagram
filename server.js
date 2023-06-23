const express = require("express");
const app = express();
const db = require("./db");
const s3 = require("./s3");
const config = require("./config");
const basicAuth = require("basic-auth");

//middleware uploader
const { uploader } = require("./upload");
exports.app = app;

let BASIC_USER;
let BASIC_PASS;
if (process.env.NODE_ENV == "production") {
  BASIC_USER = process.env.BASIC_USER;
  BASIC_PASS = process.env.BASIC_PASS;
} else {
  const secrets = require("./secrets");
  BASIC_USER = secrets.BASIC_USER;
  BASIC_PASS = secrets.BASIC_PASS;
}

const auth = function (req, res, next) {
  const creds = basicAuth(req);
  if (!creds || creds.name != BASIC_USER || creds.pass != BASIC_PASS) {
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

    res.json({ images: images.rows });
  } catch (err) {
    console.log("err in welcome: ", err);
  }
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
  const { title, description, username } = req.body;
  const { filename } = req.file;
  const fullUrl = config.s3Url + filename;

  if (req.file) {
    db.uploadImage(fullUrl, username, title, description)
      .then(({ rows }) => {
        res.json({ success: true, data: rows[0] });
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

  db.getInfoPopup(id)
    .then(({ rows }) => {
      res.json(rows);
    })
    .catch((err) => {
      console.log("there was a get pop image/id: ", err);
      res.json({ success: false });
    });
});

app.get("/loadmore/:smallestId", async (req, res) => {
  let { smallestId } = req.params;

  db.getLastImageId(smallestId)
    .then(({ rows }) => {
      res.json(rows);
    })
    .catch((err) => {
      console.log("error in loading more results", err);
    });
});

app.get("/comments/:imageId", (req, res) => {
  console.log("I am the comment route");
  let { imageId } = req.params;

  db.getAllComments(imageId)
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

app.get("/likes/:imageId", (req, res) => {
  const { imageId } = req.params;

  db.countLikes(imageId)
    .then(({ rows }) => {
      res.json(rows);
    })
    .catch((err) => {
      console.log("there was an error in get likes: ", err);
    });
});

app.post("/likes/:imageId", (req, res) => {
  const { imageId } = req.params;

  db.addLike(imageId)
    .then(({ rows }) => {
      res.json(rows);
    })
    .catch((err) => {
      console.log("err in adding likes in DB: ", err);
      res.json({ success: false });
    });
});

app.get("/likes", (req, res) => {
  db.getAllTotalLikes()
    .then(({ rows }) => {
      res.json(rows);
    })
    .catch((err) => {
      console.log("there was an error in get likes: ", err);
    });
});

app.post("/delete/:imageId", async (req, res) => {
  const { imageId } = req.params;

  try {
    const likes = await db.deleteLikes(imageId);
    const comments = await db.deleteComments(imageId);

    const image = await db.deletePost(imageId);

    res.json({ success: true });
  } catch (err) {
    console.log("err in delete images: ", err);
  }
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
  app.listen(process.env.PORT || 3000, () => {
    console.log("Server is listening on port...");
  });
}
