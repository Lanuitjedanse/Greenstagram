const spicedPg = require("spiced-pg");
// const images = require("./images.sql");

const { dbUsername, dbPassword } = require("./secrets");
const db = spicedPg(
    `postgres:${dbUsername}:${dbPassword}@localhost:5432/gallery`
);

module.exports.getImages = () => {
    const q = `SELECT * FROM images ORDER BY id DESC`;
    // const q = `SELECT * FROM images ORDER BY id DESC LIMIT 12`;

    return db.query(q);
};

module.exports.uploadImage = (url, username, title, description) => {
    const q = `INSERT INTO images (url, username, title, description) 
    VALUES ($1, $2, $3, $4) RETURNING *`;
    const params = [url, username, title, description];
    return db.query(q, params);
};
