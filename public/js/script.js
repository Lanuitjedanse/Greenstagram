// console.log("yoooo");

// This is where all our vue code will exist
(function () {
    new Vue({
        el: "#main",
        data: {
            name: "Lucie",
            seen: true,
            images: [],
        }, // data ends

        mounted: function () {
            // console.log("my vue instance has mounted");
            console.log("this outside axios: ", this);

            var self = this;

            axios.get("/welcome").then(function (response) {
                console.log("response from /images: ", response.data);
                // console.log("this inside axios: ", this);
                self.images = response.data;
            });

            // OR
            // axios.get("/cities").then((response) => {
            //     console.log("response from /cities: ", response.data);
            //     console.log("this inside axios: ", this);
            // });
        },

        methods: {
            loadMore: function () {},
        },

        // methods: {
        //     SortImages: function (response) {
        //         let responseSort = response.rows;
        //         let latestPublished = responseSort.sort((a, b) => {
        //             return new Date(b.created_at) - new Date(a.created_at);
        //         });
        //         return latestPublished;
        //     },
        // },
    });
})();
