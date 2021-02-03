// console.log("yoooo");

// This is where all our vue code will exist
(function () {
    Vue.component("popupModal", {
        template: "#modal",
        data: function () {
            return {
                count: 0,
                image: [],
                // comments: [],
            };
        },
        props: ["title", "description", "id"],
        mounted: function () {
            var self = this;
            axios
                .get(`/popup/${this.id}`)
                .then(function (response) {
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

    Vue.component("commentModal", {
        template: "#comment",
        data: function () {
            return {
                comments: [],
                username: "",
                comment: "",
            };
        },
        props: ["id"],
        mounted: function () {
            var self = this;
            axios
                .get(`/comments/${this.imageId}`)
                .then(function (response) {
                    self.comments = response.data;
                })
                .catch(function (err) {
                    console.log("error get welcome: ", err);
                });
        },
        methods: {
            // submitComment: function () {
            //     this.$emit("add");
            // },

            addComment: function (e) {
                e.preventDefault();
                var self = this;
                var commentObject = {
                    username: this.username,
                    comment: this.comment,
                    created_at: this.created_at,
                    id: this.id,
                };
                axios
                    .post("/comments", commentObject)
                    .then(function (response) {
                        self.comments.unshift(response.data);
                    })
                    .catch(function (err) {
                        console.log("error add comment axios: ", err);
                    });
            },
        },
        // },
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
            smallestId: "",
            errorMessage: "",
            showBtn: true,
        }, // data ends

        mounted: function () {
            // console.log("this outside axios: ", this);

            var self = this;

            axios
                .get("/welcome")
                .then(function (response) {
                    self.images = response.data;
                    console.log("self.images: ", self.images);
                })
                .catch(function (err) {
                    console.log("error get welcome: ", err);
                });
        },

        methods: {
            loadMore: function () {
                var smallestId = this.images[this.images.length - 1].id;
                // console.log(smallestId);
                var self = this;
                axios
                    .get(`/loadmore/${smallestId}`)
                    .then(function (response) {
                        for (var i = 0; i < response.data.length; i++) {
                            self.images.push(response.data[i]);

                            if (
                                response.data[i].id ===
                                response.data[0].lowestId
                            ) {
                                self.showBtn = false;
                            }
                        }
                    })
                    .catch(function (err) {
                        console.log("err in axios load more: ", err);
                    });
            },
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
