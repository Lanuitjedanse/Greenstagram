const express = require("express");
const app = express();

app.use(express.static("public"));

let cities = [
    {
        name: "Berlin",
        country: "Germany",
    },
    {
        name: "Guayaquil",
        country: "Ecuador",
    },
    {
        name: "Venice",
        country: "Italy",
    },
];

app.get("/cities", (req, res) => {
    res.json(cities);
});

app.listen(8080, () => console.log("IB server is listening..."));
