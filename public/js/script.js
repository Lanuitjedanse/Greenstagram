// console.log("yoooo");

// This is where all our vue code will exist
(function () {
    Vue.component("popupModal", {
        template: "#modal",
        data: function () {
            return {
                count: 0,
                image: [],
                // userNamePop: "",
                // titlePop: "",
                // descriptionPop: "",
                // images: [],
                // username: "",
                // title: "",
                // description: "",
                // title: "",
            };
        },
        props: ["title", "description", "id"],
        mounted: function () {
            console.log("component mounted: ", this.title);
            console.log("component mounted: ", this.description);
            console.log("component mounted: ", this.id);
            var self = this;
            axios
                .get(`/popup/${this.id}`)
                .then(function (response) {
                    // console.log("response from /images: ", response.data);
                    // console.log("this inside axios: ", this);
                    self.image = response.data[0];
                })
                .catch(function (err) {
                    console.log("error get welcome: ", err);
                });
        },
        methods: {
            // increaseLikes: function () {
            //     this.count++;
            // },
            closeModal: function () {
                console.log("close modal");
                this.$emit("close");
            },
        },
    });

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
            selectedPost: null,
            errorMessage: "",
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
                    console.log("self.images: ", self.images);
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
            // openModal: function () {
            //     console.log("open modal");
            //     this.selectedPost = this.id;
            //     console.log("this.selectedPost: ", this.selectedPost);
            // },
            closeModal: function () {
                console.log("I heard emit event and will close");
                this.selectedPost = null;
            },
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
                        if (response.data.success) {
                            self.images.unshift(response.data.data);
                            self.title = "";
                            self.description = "";
                            self.username = "";
                            self.$refs.fileInput.value = null;
                        } else {
                            self.errorMessage = "There was an error";
                            console.log("error");
                        }
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
