app.component("postMain", {
  templateUrl: "/mix-app/views/app-portal/pages/post/components/main/view.html",
  bindings: {
    post: "=",
  },
  controller: [
    "$rootScope",
    "$scope",
    function ($rootScope, $scope) {
      var ctrl = this;
      ctrl.translate = $rootScope.translate;
      ctrl.generateSeo = function () {
        if (ctrl.post) {
          if (!ctrl.post.seoName) {
            ctrl.post.seoName = $rootScope.generateKeyword(
              ctrl.post.title,
              "-"
            );
          }
          if (!ctrl.post.seoTitle) {
            ctrl.post.seoTitle = ctrl.post.title;
          }
          if (!ctrl.post.seoDescription === null) {
            ctrl.post.seoDescription = ctrl.post.excerpt;
          }
          if (!ctrl.post.seoKeywords) {
            ctrl.post.seoKeywords = ctrl.post.title;
          }
        }
      };
    },
  ],
});
