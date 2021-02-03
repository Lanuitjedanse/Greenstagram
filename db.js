const spicedPg = require("spiced-pg");
// const images = require("./images.sql");

const { dbUsername, dbPassword } = require("./secrets");
const db = spicedPg(
    `postgres:${dbUsername}:${dbPassword}@localhost:5432/gallery`
);

module.exports.getImages = () => {
    const q = `SELECT * FROM images ORDER BY id DESC LIMIT 9`;

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

module.exports.getMoreImages = (lastId) => {
    const q = `SELECT * FROM images
        WHERE id < $1
        ORDER BY id DESC
        LIMIT 10`;
    const params = [lastId];
    return db.query(q, params);
};

module.exports.getLastImageId = (lastId) => {
    const q = `SELECT url, title, id, (
      SELECT id FROM images
      ORDER BY id ASC
      LIMIT 1
  ) AS "lowestId" FROM images
  WHERE id < $1
  ORDER BY id DESC
  LIMIT 10`;
    const params = [lastId];
    return db.query(q, params);
};
