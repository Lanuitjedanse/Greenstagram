// console.log("yoooo");

// This is where all our vue code will exist
(function () {
    Vue.component("popupModal", {
        template: "#modal",
        data: function () {
            return {
                // count: 0,
                image: [],
                date: "",
                likes: 0,

                // comments: [],
            };
        },
        props: ["title", "description", "id"],
        mounted: function () {
            this.getTotalLikes();
            var self = this;
            // self.id = location.hash.slice(1);
            axios
                .get(`/popup/${this.id}`)
                .then(function (response) {
                    self.date = response.data[0].created_at.slice(0, 10);
                    self.image = response.data[0];
                    // self.created_at = response.data[0].created_at.slice(0, 10);
                })
                .catch(function (err) {
                    console.log("error get welcome: ", err);
                });
        },

        watch: {
            id: function () {
                var self = this;
                // self.id = location.hash.slice(1);
                axios
                    .get(`/popup/${this.id}`)
                    .then(function (response) {
                        if (response.data.length === 0) {
                            self.$emit("close");
                        } else {
                            self.date = response.data[0].created_at.slice(
                                0,
                                10
                            );
                            self.image = response.data[0];
                        }
                    })
                    .catch(function (err) {
                        console.log("error get popup: ", err);
                    });
            },
        },
        methods: {
            increaseLikes: function () {
                var self = this;
                axios
                    .post(`/likes/${self.id}`)
                    .then(function () {
                        self.likes++;
                    })
                    .catch(function (err) {
                        console.log("error", err);
                    });
            },
            closeModal: function () {
                console.log("close modal");
                this.$emit("close");
            },
            getTotalLikes: function () {
                var self = this;
                axios
                    .get(`/likes/${this.id}`)
                    .then(function (response) {
                        console.log(response.data);
                        self.likes = response.data[0].count;
                    })
                    .catch(function (err) {
                        console.log("error", err);
                    });
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

            // self.id = location.hash.slice(1);
            axios
                .get(`/comments/${this.id}`)
                .then(function (response) {
                    for (var i = 0; i < response.data.length; i++) {
                        self.comments.unshift({
                            comment: response.data[i].comment,
                            created_at: response.data[i].created_at.slice(
                                0,
                                10
                            ),
                            id: response.data[i].id,
                            image_id: response.data[i].image_id,
                            username: response.data[i].username,
                        });
                    }
                    // console.log("response.dat: ", response.data);
                    // self.date = response.data.created_at.slice(0, 10);
                    // self.comments = response.data;
                })
                .catch(function (err) {
                    console.log("error get welcome: ", err);
                });
        },
        watch: {
            id: function () {
                var self = this;
                // self.id = location.hash.slice(1);

                axios
                    .get(`/comments/${this.id}`)
                    .then(function (response) {
                        // console.log("response: ", response);
                        for (var i = 0; i < response.data.length; i++) {
                            self.comments.unshift({
                                comment: response.data[i].comment,
                                created_at: response.data[i].created_at.slice(
                                    0,
                                    10
                                ),
                                id: response.data[i].id,
                                image_id: response.data[i].image_id,
                                username: response.data[i].username,
                            });
                        }
                    })
                    .catch(function (err) {
                        console.log("error get popup: ", err);
                    });
            },
        },
        methods: {
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
                        for (var i = 0; i < response.data.length; i++) {
                            self.comments.unshift({
                                comment: response.data[i].comment,
                                created_at: response.data[i].created_at.slice(
                                    0,
                                    10
                                ),
                                id: response.data[i].id,
                                image_id: response.data[i].image_id,
                                username: response.data[i].username,
                            });
                        }
                        self.username = "";
                        self.comment = "";
                    })
                    .catch(function (err) {
                        console.log("error add comment axios: ", err);
                    });
            },

            // deleteImage: function () {
            //     this.selectedPost = null;
            //     var self = this;

            //     axios
            //         .get("/delete", self.id)
            //         .then(function () {
            //             for (var i = 0; i < self.images.length; i++) {
            //                 if (self.images[i].id === self.id) {
            //                     self.images.splice(i, 1);
            //                     break;
            //                 }
            //             }
            //         })
            //         .catch(function (err) {
            //             console.log("err in delete image: ", err);
            //         });
            // },
        },
    });

    new Vue({
        el: "#main",
        data: {
            images: [],
            username: "",
            title: "",
            description: "",
            file: null,
            selectedPost: location.hash.slice(1),
            smallestId: "",
            errorMessage: false,
            showBtn: true,
            scrollPos: 0,
            likes: [],
        }, // data ends

        mounted: function () {
            var self = this;

            this.getTotalLikes();

            addEventListener("hashchange", () => {
                this.selectedPost = location.hash.slice(1);
                console.log("offset Y: ", window.pageYOffset);
                this.scrollPos = window.pageYOffset;
            });

            axios
                .get("/welcome")
                .then(function (response) {
                    console.log("response.data: ", response.data);
                    let images = response.data.rowsImages;
                    let likes = response.data.rowsLikes;
                    let imagesAndLikes = images.map((image, i) => ({
                        ...image,
                        likes: likes[i].count,
                    }));

                    self.images = imagesAndLikes;
                })
                .catch(function (err) {
                    console.log("error get welcome: ", err);
                });
        },

        methods: {
            loadMore: function () {
                var smallestId = this.images[this.images.length - 1].id;
                var self = this;
                axios
                    .get(`/loadmore/${smallestId}`)
                    .then(function (response) {
                        let imagesAndLikes = response.data.images.map(
                            (image, i) => ({
                                ...image,
                                likes: response.data.likes[i].count,
                            })
                        );

                        for (var i = 0; i < imagesAndLikes.length; i++) {
                            if (
                                imagesAndLikes[i].id ===
                                imagesAndLikes[0].lowestId
                            ) {
                                self.showBtn = false;
                            }

                            self.images.push(imagesAndLikes[i]);
                        }
                    })
                    .catch(function (err) {
                        console.log("err in axios load more: ", err);
                    });
            },
            closeModal: function () {
                console.log("I heard emit event and will close");
                var self = this;

                location.hash = "";
                window.scrollTo(0, self.scrollPos);
                window.history.replaceState({}, "", "/");
                self.selectedPost = null;
            },
            clickHandler: function () {
                var self = this;
                var fd = new FormData();
                fd.append("title", this.title);
                fd.append("description", this.description);
                fd.append("username", this.username);
                fd.append("file", this.file);

                axios
                    .post("/upload", fd)
                    .then(function (response) {
                        if (response.data.success) {
                            self.errorMessage = null;
                            self.images.unshift(response.data.data);
                            self.title = "";
                            self.description = "";
                            self.username = "";
                            self.$refs.fileInput.value = null;
                        } else {
                            self.errorMessage = "File missing";
                            console.log("error");
                        }
                    })
                    .catch(function (err) {
                        console.log("error in post upload: ", err);
                        self.errorMessage =
                            "Fill out all the fields, or file is too large (max 2MB)";
                        self.title = "";
                        self.description = "";
                        self.username = "";
                        self.$refs.fileInput.value = null;
                    });
            },

            getTotalLikes: function () {
                var self = this;
                axios
                    .get(`/likes`)
                    .then(function (response) {
                        for (var i = 0; i < response.data.length; i++) {
                            self.likes.push({
                                count: response.data[i].count,
                                id: response.data[i].image_id,
                            });
                            console.log(
                                "response.data: ",
                                response.data[i].count
                            );
                        }
                    })
                    .catch(function (err) {
                        console.log("error", err);
                    });
            },

            increaseLikes: function () {
                var self = this;

                // console.log("selectedpost: ", self.selectedPost);
                console.log(self.id);
                axios
                    .post(`/likes/${this.imageId}`)
                    .then(function (response) {
                        console.log("selectedpost", self.selectedPost);
                        console.log("elf.id: ", response.data[0]);
                        // if (self.selectedPost === self.id) {
                        //     self.likes++;
                        // }
                        self.likes++;
                    })
                    .catch(function (err) {
                        console.log("error", err);
                    });
            },

            fileSelectHandler: function (e) {
                this.file = e.target.files[0];
            },
        },
    });
})();
