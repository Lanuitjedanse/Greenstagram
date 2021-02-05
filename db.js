const spicedPg = require("spiced-pg");
// const images = require("./images.sql");

const { dbUsername, dbPassword } = require("./secrets");
const db = spicedPg(
    `postgres:${dbUsername}:${dbPassword}@localhost:5432/gallery`
);

module.exports.getImages = () => {
    const q = `SELECT * FROM images ORDER BY id DESC LIMIT 6`;

    return db.query(q);
};

module.exports.uploadImage = (url, username, title, description) => {
    const q = `INSERT INTO images (url, username, title, description) 
    VALUES ($1, $2, $3, $4) RETURNING *`;
    const params = [url, username, title, description];
    return db.query(q, params);
};

module.exports.getInfoPopup = (id) => {
    const q = `SELECT * FROM images WHERE id=$1`;
    const params = [id];
    return db.query(q, params);
};

// module.exports.getMoreImages = (lastId) => {
//     const q = `SELECT * FROM images
//         WHERE id < $1
//         ORDER BY id DESC
//         LIMIT 10`;
//     const params = [lastId];
//     return db.query(q, params);
// };

module.exports.getLastImageId = (lastId) => {
    const q = `SELECT url, title, id, (
      SELECT id FROM images
      ORDER BY id ASC
      LIMIT 1
  ) AS "lowestId" FROM images
  WHERE id < $1
  ORDER BY id DESC
  LIMIT 6`;
    const params = [lastId];
    return db.query(q, params);
};

module.exports.insertComment = (comment, username, imageId) => {
    const q = `INSERT INTO comments (comment, username, image_id)
    VALUES ($1, $2, $3) RETURNING *`;
    const params = [comment, username, imageId];
    return db.query(q, params);
};

module.exports.getAllComments = (imageId) => {
    const q = `SELECT * FROM comments WHERE image_id = $1`;
    const params = [imageId];
    return db.query(q, params);
};

// module.exports.deletePost = (imageId) => {
//     const q = ` DELETE images
//       FROM images
//         INNER JOIN comments
//         ON images.id=comments.image_id
//      WHERE id = $1`;

//     const params = [imageId];

//     return db.query(q, params);
// };

// module.exports.deleteImage = (imageId) => {
//     const q = `DELETE FROM images
//     WHERE id = $1`;
//     const params = [imageId];
//     return db.query(q, params);
// };

// module.exports.deleteComment = (imageId) => {
//     const q = `DELETE FROM comments
//     WHERE image_id = $1`;
//     const params = [imageId];
//     return db.query(q, params);
// };

module.exports.addLike = (imageId) => {
    const q = `INSERT INTO likes (image_id) VALUES ($1) RETURNING *`;
    const params = [imageId];
    return db.query(q, params);
};

module.exports.countLikes = (imageId) => {
    const q = `SELECT COUNT (*) FROM likes WHERE image_id = $1`;
    const params = [imageId];
    return db.query(q, params);
};
