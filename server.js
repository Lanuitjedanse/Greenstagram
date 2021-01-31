const express = require("express");
const app = express();
const db = require("./db");

exports.app = app;

app.use(express.static("public"));

// app.get("/welcome", (req, res) => {
//     db.getImages()
//         .then(({ rows }) => {
//             let images = [];
//             const latestPublished = rows.sort((a, b) => {
//                 return new Date(b.created_at) - new Date(a.created_at);
//             });

//             for (let i = 0; i < latestPublished.length; i++) {
//                 images.push({
//                     url: latestPublished[i].url,
//                     title: latestPublished[i].title,
//                     // created_at: latestPublished[i].created_at,
//                 });
//             }

//             console.log("images: ", images);

//             return res.json(images);
//             // console.log("images: ", images);
//         })
//         .catch((err) => {
//             console.log("err in get images: ", err);
//         });
// });

app.get("/welcome", (req, res) => {
    db.getImages()
        .then((response) => {
            // let responseSort = response.rows;
            // let latestPublished = responseSort.sort((a, b) => {
            //     return new Date(b.created_at) - new Date(a.created_at);
            // });

            // console.log("images: ", latestPublished);

            return res.json(response.rows);
        })
        .catch((err) => {
            console.log("err in get images: ", err);
        });
});

app.listen(8080, () => console.log("IB server is listening..."));
