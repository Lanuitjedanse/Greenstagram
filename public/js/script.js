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
            // self.id = location.hash.slice(1);
            axios
                .get(`/popup/${this.id}`)
                .then(function (response) {
                    if (response.data.length === 0) {
                        self.$emit("close");
                    } else {
                        self.image = response.data[0];
                    }
                })
                .catch(function (err) {
                    console.log("error get welcome: ", err);
                });
        },

        watch: {
            selectedPost: function () {
                var self = this;
                // self.id = location.hash.slice(1);
                axios
                    .get(`/popup/${this.id}`)
                    .then(function (response) {
                        self.image = response.data[0];
                    })
                    .catch(function (err) {
                        console.log("error get popup: ", err);
                    });
            },
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

            // self.id = location.hash.slice(1);
            axios
                .get(`/comments/${this.id}`)
                .then(function (response) {
                    self.comments = response.data;
                })
                .catch(function (err) {
                    console.log("error get welcome: ", err);
                });
        },
        watch: {
            selectedPost: function () {
                var self = this;
                // self.id = location.hash.slice(1);

                axios
                    .get(`/popup/${this.id}`)
                    .then(function (response) {
                        console.log("response: ", response);
                        if (response.data.length === 0) {
                            self.$emit("close");
                        } else {
                            self.image = response.data[0];
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
                        self.comments.unshift(response.data[0]);
                        self.username = "";
                        self.comment = "";
                    })
                    .catch(function (err) {
                        console.log("error add comment axios: ", err);
                    });
            },
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
            errorMessage: "",
            showBtn: true,
        }, // data ends

        mounted: function () {
            var self = this;
            addEventListener("hashchange", () => {
                this.selectedPost = location.hash.slice(1);
            });

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
                var self = this;

                location.hash = "";
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
                this.file = e.target.files[0];
            },
        },
    });
})();
