const spicedPg = require("spiced-pg");
// const images = require("./images.sql");

const { dbUsername, dbPassword } = require("./secrets");
const db = spicedPg(
    `postgres:${dbUsername}:${dbPassword}@localhost:5432/gallery`
);

module.exports.getImages = () => {
    const q = `SELECT * FROM images ORDER BY id DESC LIMIT 12`;
    return db.query(q);
};
