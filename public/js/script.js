// console.log("yoooo");

// This is where all our vue code will exist
(function () {
    // console.log(btnUpload);
    new Vue({
        el: "#main",
        data: {
            // name: "Lucie",
            // seen: true,
            images: [],
            username: "",
            title: "",
            description: "",
            file: null,
        }, // data ends

        mounted: function () {
            // console.log("my vue instance has mounted");
            console.log("this outside axios: ", this);

            var self = this;

            axios
                .get("/welcome")
                .then(function (response) {
                    // console.log("response from /images: ", response.data);
                    // console.log("this inside axios: ", this);
                    self.images = response.data;
                })
                .catch(function (err) {
                    console.log("error get welcome: ", err);
                });

            // OR
            // axios.get("/cities").then((response) => {
            //     console.log("response from /cities: ", response.data);
            //     console.log("this inside axios: ", this);
            // });
        },

        // methods: {
        //     loadMore: function () {},
        // },
        methods: {
            clickHandler: function () {
                // e.preventDefault(); // prevents form to reload page when button clicked
                // console.log("this: ", this);
                var self = this;
                var fd = new FormData();
                fd.append("title", this.title);
                fd.append("description", this.description);
                fd.append("username", this.username);
                fd.append("file", this.file);

                axios
                    .post("/upload", fd)
                    .then(function (response) {
                        // console.log("response: ", response.data);
                        // self.images = response.data;
                        self.images.unshift(response.data);
                        self.title = "";
                        self.description = "";
                        self.username = "";
                        self.$refs.fileInput.value = null;
                    })
                    .catch(function (err) {
                        console.log("error in post upload: ", err);
                    });
            },

            fileSelectHandler: function (e) {
                // console.log("e: ", e);
                this.file = e.target.files[0];
            },
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
