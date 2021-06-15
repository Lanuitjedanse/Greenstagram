(function () {
  Vue.component("popupModal", {
    template: "#modal",
    data: function () {
      return {
        // count: 0,
        image: [],
        date: "",
        likes: 0,
      };
    },
    props: ["title", "description", "id"],
    mounted: function () {
      this.getTotalLikes();

      var self = this;
      axios
        .get(`/popup/${this.id}`)
        .then(function (response) {
          self.date = response.data[0].created_at.slice(0, 10);
          self.image = response.data[0];
        })
        .catch(function (err) {
          console.log("error get welcome: ", err);
        });
    },

    watch: {
      id: function () {
        var self = this;
        axios
          .get(`/popup/${this.id}`)
          .then(function (response) {
            if (response.data.length === 0) {
              self.$emit("close");
            } else {
              self.date = response.data[0].created_at.slice(0, 10);
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
      deletePost: function (id) {
        let self = this;

        axios
          .post(`/delete/${id}`)
          .then(function () {
            self.$emit("delete", id);
            self.$emit("close");
          })
          .catch(function (err) {
            console.log("err in post delete: ", err);
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

      axios
        .get(`/comments/${this.id}`)
        .then(function (response) {
          for (var i = 0; i < response.data.length; i++) {
            self.comments.unshift({
              comment: response.data[i].comment,
              created_at: response.data[i].created_at.slice(0, 10),
              id: response.data[i].id,
              image_id: response.data[i].image_id,
              username: response.data[i].username,
            });
          }
        })
        .catch(function (err) {
          console.log("error get welcome: ", err);
        });
    },
    watch: {
      id: function () {
        var self = this;

        axios
          .get(`/comments/${this.id}`)
          .then(function (response) {
            for (var i = 0; i < response.data.length; i++) {
              self.comments.unshift({
                comment: response.data[i].comment,
                created_at: response.data[i].created_at.slice(0, 10),
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
                created_at: response.data[i].created_at.slice(0, 10),
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
        this.scrollPos = window.pageYOffset;
      });

      axios
        .get("/welcome")
        .then(function (response) {
          self.images = response.data.images;
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

              if (response.data[i].id === response.data[0].lowestId) {
                self.showBtn = false;
              }
            }
          })
          .catch(function (err) {
            console.log("err in axios load more: ", err);
          });
      },
      closeModal: function () {
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
            }
          })
          .catch(function (err) {
            console.log("error", err);
          });
      },

      increaseLikes: function () {
        var self = this;

        axios
          .post(`/likes/${this.imageId}`)
          .then(function (response) {
            self.likes++;
          })
          .catch(function (err) {
            console.log("error", err);
          });
      },

      deletePost: function (id) {
        var self = this;
        const found = self.images.find((element) => element.id == id);
        self.images.splice(self.images.indexOf(found), 1);
      },

      fileSelectHandler: function (e) {
        this.file = e.target.files[0];
      },
    },
  });
})();
