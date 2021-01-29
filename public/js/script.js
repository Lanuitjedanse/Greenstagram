// console.log("yoooo");

// This is where all our vue code will exist
(function () {
    new Vue({
        el: "#main",
        data: {
            name: "Lucie",
            seen: true,
            cities: [
                // {
                //     name: "Berlin",
                //     country: "Germany",
                // },
                // {
                //     name: "Guayaquil",
                //     country: "Ecuador",
                // },
                // {
                //     name: "Venice",
                //     country: "Italy",
                // },
            ],
        }, // data ends

        mounted: function () {
            // console.log("my vue instance has mounted");
            console.log("this outside axios: ", this);

            var self = this;

            axios.get("/cities").then(function (response) {
                console.log("response from /cities: ", response.data);
                // console.log("this inside axios: ", this);
                self.cities = response.data;
            });

            // OR
            // axios.get("/cities").then((response) => {
            //     console.log("response from /cities: ", response.data);
            //     console.log("this inside axios: ", this);
            // });
        },

        methods: {
            myFunction: function () {
                console.log("my function is running!");
            },
        },
    });
})();
