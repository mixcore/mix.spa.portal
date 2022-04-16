app.component("pageContent", {
  templateUrl:
    "/mix-app/views/app-portal/pages/page/components/page-content/view.html",
  bindings: {
    model: "=",
    additionalData: "=",
  },
  controller: [
    "$rootScope",
    "$scope",
    function ($rootScope, $scope) {
      var ctrl = this;
      ctrl.translate = $rootScope.translate;
      ctrl.$onInit = function () {
        ctrl.backUrl = `/portal/page/details`;
      };
      ctrl.generateSeo = function () {
        if ($scope.viewmodel) {
          if (ctrl.model.seoName === null || ctrl.model.seoName === "") {
            ctrl.model.seoName = $rootScope.generateKeyword(
              ctrl.model.title,
              "-"
            );
          }
          if (ctrl.model.seoTitle === null || ctrl.model.seoTitle === "") {
            ctrl.model.seoTitle = ctrl.model.title;
          }
          if (
            ctrl.model.seoDescription === null ||
            ctrl.model.seoDescription === ""
          ) {
            ctrl.model.seoDescription = ctrl.model.excerpt;
          }
          if (
            ctrl.model.seoKeywords === null ||
            ctrl.model.seoKeywords === ""
          ) {
            ctrl.model.seoKeywords = ctrl.model.title;
          }
        }
      };
    },
  ],
});
